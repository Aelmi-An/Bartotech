class TabelaEstoque {
    constructor() {
        this.tabela = document.querySelector('.Estoque');
        this.botaoNovo = document.getElementById('Novoproduto');
        this.idProduto = 1;

        this.iniciar();
    }

    iniciar() {
        if (!this.tabela || !this.botaoNovo) {
            return;
        }

        this.botaoNovo.addEventListener('click', () => {
            this.adicionar();
        });
    }

    adicionar() {
        const produto = new Produto(this.idProduto);

        this.tabela.appendChild(produto.linha);
        this.idProduto++;
    }
}

new TabelaEstoque();


class Produto {
    constructor(id, nome = '', quantidade = 0, unidade = 'UN', preco = 0) {
        this.id = id;
        this.nome = nome;
        this.quantidade = quantidade;
        this.unidade = unidade;
        this.preco = preco;

        this.criarLinha();
    }

    criarLinha() {
        this.linha = document.createElement('div');
        this.linha.classList.add('linha_Grid', 'Col6');

        const id = document.createElement('div');
        id.textContent = String(this.id).padStart(3, '0');

        this.campoNome = document.createElement('input');
        this.campoNome.type = 'text';
        this.campoNome.value = this.nome;
        this.campoNome.placeholder = 'Nome do produto';

        this.campoQuantidade = document.createElement('input');
        this.campoQuantidade.type = 'number';
        this.campoQuantidade.min = '0';
        this.campoQuantidade.value = this.quantidade;

        this.campoUnidade = document.createElement('select');

        ['UN', 'G', 'KG', 'ML', 'L'].forEach(unidade => {
            const opcao = document.createElement('option');
            opcao.value = unidade;
            opcao.textContent = unidade;
            this.campoUnidade.appendChild(opcao);
        });

        this.campoUnidade.value = this.unidade;

        this.campoPreco = document.createElement('input');
        this.campoPreco.type = 'number';
        this.campoPreco.min = '0';
        this.campoPreco.step = '0.01';
        this.campoPreco.value = this.preco;

        this.status = document.createElement('div');
        this.atualizarStatus();

        this.campoQuantidade.addEventListener('input', () => {
            this.atualizarStatus();
        });

        // Adiciona tudo à linha
        this.linha.append(
            id,
            this.campoNome,
            this.campoQuantidade,
            this.campoUnidade,
            this.campoPreco,
            this.status,
        );
    }

    atualizarStatus() {
        const quantidade = Number(this.campoQuantidade?.value ?? this.quantidade);

        if (quantidade <= 0) {
            this.status.textContent = 'Sem estoque';
        } else if (quantidade <= 2) {
            this.status.textContent = 'Crítico';
        } else if (quantidade <= 8) {
            this.status.textContent = 'Baixo';
        } else {
            this.status.textContent = 'Normal';
        }
    }
}
