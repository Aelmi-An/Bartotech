
class TabelaVendas {
    constructor(){
        this.tabela = document.querySelector('#vendas .Caixa');
        this.botaoNovo = document.getElementById('NovaVenda');
        this.idVenda = 1;
        this.iniciar();
    }

    iniciar(){
        this.botaoNovo.addEventListener('click', () => {
            this.adicionar();
            console.log("Tô conectado");
        });
    }

    adicionar() {
        const vendinhas = new Vendas(this.idVenda);
        vendinhas.criarLinhas();
        this.tabela.appendChild(vendinhas.vendas);
        this.idVenda++;
    }
}

new TabelaVendas();

class Vendas {
    constructor (id=0, produto='', cliente='', quantia=0, valor=0, data='', status='Pendente'){
        this.id=id;
        this.produto=produto;
        this.cliente=cliente;
        this.quantia=quantia;
        this.valor=valor;
        this.data=data;
        this.status=status;
    }

    criarCelula(coisinha) {
        const celula = document.createElement('div');
        celula.appendChild(coisinha);
        return celula;
    }

    criarLinhas(){
        this.vendas = document.createElement('div');
        this.vendas.classList.add('linha_Grid', 'Col8');

        const id = document.createElement('div');
        id.textContent = String(this.id).padStart(1);

        this.campoProduto = document.createElement('input');
        this.campoProduto.type = 'text';
        this.campoProduto.placeholder = 'Produto';
        this.campoProduto.value = this.produto;

        this.campoCliente = document.createElement('input');
        this.campoCliente.type = 'text';
        this.campoCliente.placeholder = 'Cliente';
        this.campoCliente.value = this.cliente;

        this.campoQuantia = document.createElement('input');
        this.campoQuantia.type = 'number';
        this.campoQuantia.min = '0';
        this.campoQuantia.value = this.quantia;

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
        ['Efetuada','Em Andamento','Pendente'].forEach(status => {
            const opcao = document.createElement('option');
            opcao.value = status;
            opcao.textContent = status;
            this.campoStatus.appendChild(opcao);
        });
        this.campoStatus.value = this.status;

        this.vendas.append(
            this.criarCelula(id),
            this.criarCelula(this.campoProduto),
            this.criarCelula(this.campoCliente),
            this.criarCelula(this.campoQuantia),
            this.criarCelula(this.campoValor),
            this.criarCelula(this.campoData),
            this.criarCelula(this.campoStatus),
            this.criarCelulaDeletar()
        );

        //  ao terminar de editar um campo, salva no banco
        [
            this.campoProduto,
            this.campoCliente,
            this.campoQuantia,
            this.campoValor,
            this.campoData,
            this.campoStatus
        ].forEach(campo => {
            campo.addEventListener('change', () => {
                this.salvar();
            });
        });
    }

    criarCelulaDeletar() {
        const celula = document.createElement('div');
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.classList.add('Botao_Sec');
        botao.textContent = 'Deletar';
        botao.addEventListener('click', async () => {
            if (await Registros.remover('vendas', this.idBanco)) {
                this.vendas.remove();
            }
        });
        celula.appendChild(botao);
        return celula;
    }

    // manda os dados para o banco
    async salvar() {
        this.produto = this.campoProduto.value.trim();
        this.cliente = this.campoCliente.value.trim();
        this.quantia = Number(this.campoQuantia.value);
        this.valor = Number(this.campoValor.value);
        this.data = this.campoData.value;
        this.status = this.campoStatus.value;

        // idBanco 0 = cria uma venda nova; maior que 0 = atualiza a que já existe
        const novoId = await Registros.salvar('vendas', this.idBanco, {
            produto: this.produto,
            cliente: this.cliente,
            quantidade: this.quantia,
            valor: this.valor,
            data: this.data,
            status: this.status
        });

        if (novoId !== 0) {
            this.idBanco = novoId;
        }
    }
}
