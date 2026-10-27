class TabelaFinancas {
    constructor() {
        this.tabela = document.querySelector('#financeiro .Caixa');
        this.botaoNovo = document.getElementById('NovoPaga');
        this.idFinancas = 1;
        this.iniciar();
    }

    iniciar() {
        // ao abrir a página, busca os pagamentos salvos no banco
        this.carregar();

        this.botaoNovo.addEventListener('click', () => {this.adicionar(); console.log("Tô conectado")});
    }

    // forma cada pagamento que veio do banco (tive que pesquisar como faz, não é um codigo codigo inteiramente meu.)
    async carregar() {
        const lista = await Registros.listar('financas');

        lista.forEach(item => {
            const d = item.dados;
            const Financa = new Financas(this.idFinancas, d.tipo, d.descricao, d.valor, d.data, d.status);

            Financa.idBanco = item.id;

            this.tabela.appendChild(Financa.financa);
            this.idFinancas++;
        });
    }

    async adicionar() {
        const Financa = new Financas(this.idFinancas);
        this.idFinancas++;

        // cria o pagamento no banco antes de mostrar a linha
        await Financa.salvar();

        if (Financa.idBanco === 0) {
            return; 
        }

        this.tabela.appendChild(Financa.financa);
    }
}

class Financas {
    constructor(id, tipo = 'Entrada', descricao = '', valor = '', data = '', status = 'Em Andamento') {
        this.id = id;
        this.idBanco = 0;
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

        this.financa.appendChild(Registros.botaoApagar('financas', this, this.financa));

        // ao terminar de editar um campo, salva no banco
        [
            this.campoTipo,
            this.campoDescricao,
            this.campoValor,
            this.campoData,
            this.campoStatus
        ].forEach(campo => {
            campo.addEventListener('change', () => {
                this.salvar();
            });
        });
    }

    // manda os dados para o banco
    async salvar() {
        this.tipo = this.campoTipo.value;
        this.descricao = this.campoDescricao.value;
        this.valor = this.campoValor.value;
        this.data = this.campoData.value;
        this.status = this.campoStatus.value;

        // idBanco 0 = cria um pagamento novo; maior que 0 = atualiza o que já existe
        const novoId = await Registros.salvar('financas', this.idBanco, {
            tipo: this.tipo,
            descricao: this.descricao,
            valor: this.valor,
            data: this.data,
            status: this.status
        });

        if (novoId !== 0) {
            this.idBanco = novoId;
        }
    }
}

new TabelaFinancas();