class TabelaFinancas {
    constructor() {
        this.tabela = document.querySelector('#financeiro .Caixa');
        this.botaoNovo = document.getElementById('NovoPaga');
        this.iniciar();
    }

    iniciar() {
        this.botaoNovo.addEventListener('click', () => {this.adicionar(); console.log("Tô conectado")});
    }

    adicionar() {
        const Financa = new Financas(this.idFinancas);

        this.tabela.appendChild(Financa.financa);
        this.idFinancas++;
    }
}

class Financas {
    constructor(id, tipo = 'Entrada', descricao = '', valor = '', data = '', status = 'Em Andamento') {
        this.id = id;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
        this.status = status;

        this.criarLinhas();
    }

    criarCelula(slacoisas) {
        const celula = document.createElement('div');
        celula.appendChild(slacoisas);
        return celula;
    }

    criarLinhas() {
        this.financa = document.createElement('div');
        this.financa.classList.add('linha_Grid', 'Col5');

        this.campoTipo = document.createElement('select');
        ['Entrada', 'Saída'].forEach(tipo => {
            const opcao = document.createElement('option');
            opcao.value = tipo;
            opcao.textContent = tipo;
            this.campoTipo.appendChild(opcao);
        });

        this.campoTipo.value = this.tipo;

        this.campoDescricao = document.createElement('input');
        this.campoDescricao.type = 'text';
        this.campoDescricao.placeholder = 'Descrição';
        this.campoDescricao.value = this.descricao;

        this.campoValor = document.createElement('input');
        this.campoValor.type = 'number';
        this.campoValor.min = '0';
        this.campoValor.step = '0.01';
        this.campoValor.placeholder = '0,00';
        this.campoValor.value = this.valor;

        this.campoData = document.createElement('input');
        this.campoData.type = 'date';
        this.campoData.value = this.data;

        this.campoStatus = document.createElement('select');
        ['Recebido/Pago','Em Andamento','A ser Recebido/Pago'].forEach(status => {
            const opcao = document.createElement('option');
            opcao.value = status;
            opcao.textContent = status;
            this.campoStatus.appendChild(opcao);
        });

        this.campoStatus.value = this.status;

        this.financa.append(
            this.criarCelula(this.campoTipo),
            this.criarCelula(this.campoDescricao),
            this.criarCelula(this.campoValor),
            this.criarCelula(this.campoData),
            this.criarCelula(this.campoStatus)
        );
    }
}

new TabelaFinancas();