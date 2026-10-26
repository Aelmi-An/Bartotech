class ExportarCSV {
    constructor() {
        this.botao = document.getElementById('exportar-csv');

        if (this.botao) {
            this.botao.addEventListener('click', () => {
                this.exportar();
            });
        }
    }

    secaoAtual() {
        return document.querySelector('.secao:not([hidden])');
    }

    secoesDeDados() {
        return Array.from(document.querySelectorAll('.secao')).filter(secao => {
            return secao.id !== 'tabelas' && secao.querySelector('.Cabeçalho_Planilha');
        });
    }

    tituloDaSecao(secao) {
        let titulo = secao.querySelector('h1');
        return titulo ? titulo.textContent.trim() : secao.id;
    }

    lerCelula(celula) {
        let campo = celula.matches('input, select, textarea')
            ? celula
            : celula.querySelector('input, select, textarea');

        if (!campo) {
            return celula.textContent.trim();
        }

        if (campo.type === 'date' && campo.value) {
            let [ano, mes, dia] = campo.value.split('-');
            return dia + '/' + mes + '/' + ano;
        }

        if (campo.type === 'number') {
            return String(campo.value).replace('.', ',');
        }

        let texto = campo.value.trim();

        if (/^[=+\-@]/.test(texto)) {
            texto = "'" + texto;
        }

        return texto;
    }

    montarLinha(valores) {
        return valores
            .map(valor => '"' + String(valor).replace(/"/g, '""') + '"')
            .join(';');
    }

    montarTabela(secao) {
        let linhas = [];
        let cabecalho = secao.querySelector('.Cabeçalho_Planilha');

        if (cabecalho) {
            let titulos = Array.from(cabecalho.children).map(celula => celula.textContent.trim());
            linhas.push(this.montarLinha(titulos));
        }

        let total = 0;

        secao.querySelectorAll('.linha_Grid').forEach(linha => {
            if (linha.hidden) {
                return;
            }

            let valores = Array.from(linha.children).map(celula => this.lerCelula(celula));
            linhas.push(this.montarLinha(valores));
            total++;
        });

        return { texto: linhas.join('\r\n'), total: total };
    }

    montarTudo() {
        let blocos = [];
        let total = 0;

        this.secoesDeDados().forEach(secao => {
            let tabela = this.montarTabela(secao);

            if (tabela.total === 0) {
                return;
            }

            let titulo = this.montarLinha([this.tituloDaSecao(secao)]);
            blocos.push(titulo + '\r\n' + tabela.texto);
            total += tabela.total;
        });

        return { texto: blocos.join('\r\n\r\n'), total: total };
    }

    nomeArquivo(nome) {
        nome = nome
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        let hoje = new Date().toISOString().slice(0, 10);

        return 'planum-' + nome + '-' + hoje + '.csv';
    }

    exportar() {
        let secao = this.secaoAtual();

        if (!secao) {
            return;
        }

        let todas = secao.id === 'tabelas';
        let csv = todas ? this.montarTudo() : this.montarTabela(secao);
        let nome = todas ? 'todas-as-tabelas' : this.tituloDaSecao(secao);

        if (csv.total === 0) {
            alert('Não há linhas para exportar.');
            return;
        }

        let arquivo = new Blob(['\uFEFF' + csv.texto], { type: 'text/csv;charset=utf-8;' });
        let endereco = URL.createObjectURL(arquivo);
        let link = document.createElement('a');

        link.href = endereco;
        link.download = this.nomeArquivo(nome);
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => {
            URL.revokeObjectURL(endereco);
        }, 1000);
    }
}

new ExportarCSV();