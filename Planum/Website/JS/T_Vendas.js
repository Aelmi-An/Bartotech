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
        this.vendas.classList.add('linha_Grid', 'Col7');

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
            this.criarCelula(this.campoStatus)
        );

        this.botaoApagar = document.createElement('button');
        this.botaoApagar.type = 'button';
        this.botaoApagar.className = 'apagar';
        this.botaoApagar.title = 'Apagar linha';
        this.botaoApagar.textContent = '×';
        this.botaoApagar.addEventListener('click', () => {
            if (confirm('Quer mesmo apagar esta linha?')) {
                this.vendas.remove();
            }
        });
        this.vendas.appendChild(this.botaoApagar);
    }
}