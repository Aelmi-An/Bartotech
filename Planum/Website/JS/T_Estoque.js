class TabelaEstoque {
    constructor() {
        this.tabela = document.querySelector('.Estoque');
        this.botaoNovo = document.getElementById('NovoProduto');
        this.idProduto = 1;

        this.iniciar();
    }

    iniciar() {
        // ao abrir a pagina, busca os prdutos salvos no banco
        this.carregar();

        this.botaoNovo.addEventListener('click', () => {this.adicionar(); console.log("conectado")});
    }

    // forma cada produto que veio do banco (tive que pesquisar como faz, não é um codigo codigo inteiramente meu.)
    async carregar() {
        const lista = await Registros.listar('estoque');

        lista.forEach(item => {
            const d = item.dados;
            const produto = new Produto(this.idProduto, d.nome, d.quantidade, d.unidade, d.preco);

            produto.idBanco = item.id;

            this.tabela.appendChild(produto.linha);
            this.idProduto++;
        });
    }

    async adicionar() {
        const produto = new Produto(this.idProduto);
        this.idProduto++;

        // cria o produto no banco antes de mostrar a linha
        await produto.salvar();

        if (produto.idBanco === 0) {
            return; // não salvou, então não mostra a linha
        }

        this.tabela.appendChild(produto.linha);
    }
}

new TabelaEstoque();


class Produto {
    constructor(id, nome = '', quantidade = 0, unidade = 'UN', preco = 0, deletar='') {
        this.id = id;
        this.idBanco = 0;
        this.nome = nome;
        this.quantidade = quantidade;
        this.unidade = unidade;
        this.preco = preco;
        this.deletar = deletar;
        this.criarLinha();
    }

    criarLinha() {
        this.linha = document.createElement('div');
        this.linha.classList.add('linha_Grid', 'Col6');

        const id = document.createElement('div');
        id.textContent = String(this.id).padStart('0');

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

        // ao terminar de editar um campo, salva no banco
        [this.campoNome, this.campoQuantidade, this.campoUnidade, this.campoPreco].forEach(campo => {
            campo.addEventListener('change', () => {
                this.salvar();
            });
        });

        this.linha.append(
            id,
            this.campoNome,
            this.campoQuantidade,
            this.campoUnidade,
            this.campoPreco,
            this.status,
        );

        this.linha.appendChild(Registros.botaoApagar('estoque', this, this.linha));
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

    // manda os dados para o banco
    async salvar() {
        this.nome = this.campoNome.value.trim();
        this.quantidade = Number(this.campoQuantidade.value);
        this.unidade = this.campoUnidade.value;
        this.preco = Number(this.campoPreco.value);

        this.atualizarStatus();

        // se idBanco = 0 cria um produto novo, maior que 0 = atualiza o que já existe
        const novoId = await Registros.salvar('estoque', this.idBanco, {
            nome: this.nome,
            quantidade: this.quantidade,
            unidade: this.unidade,
            preco: this.preco
        });

        if (novoId !== 0) {
            this.idBanco = novoId;
        }
    }
}