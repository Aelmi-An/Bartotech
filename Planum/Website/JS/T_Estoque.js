
class TabelaEstoque {
    constructor() {
        this.tabela = document.querySelector('.Estoque');
        this.botaoNovo = document.getElementById('NovoProduto');
        this.idProduto = 1;

        this.iniciar();
    }

    iniciar() {
        if (!this.tabela || !this.botaoNovo) {
            console.error('Tabela de estoque ou botão Novo Produto não encontrado.');
            return;
        }

        this.carregar();

        this.botaoNovo.addEventListener('click', () => {
            this.adicionar();
        });
    }

    async carregar() {
        try {
            const lista = await Registros.listar('estoque');

            if (!Array.isArray(lista)) {
                console.error('A resposta dos registros não é uma lista.');
                return;
            }

            lista.forEach(item => {
                const d = item.dados;

                if (!d) return;

                const produto = new Produto(
                    this.idProduto,
                    d.nome ?? '',
                    d.quantidade ?? 0,
                    d.unidade ?? 'UN',
                    d.preco ?? 0
                );

                produto.idBanco = Number(item.id) || 0;

                this.tabela.appendChild(produto.linha);
                this.idProduto++;
            });
        } catch (erro) {
            console.error('Erro ao carregar os produtos:', erro);
            alert('Não foi possível carregar o estoque. Verifique a conexão com o servidor.');
        }
    }

    async adicionar() {
        const botao = this.botaoNovo;
        botao.disabled = true;

        try {
            const produto = new Produto(this.idProduto);

            await produto.salvar();

            if (produto.idBanco === 0) {
                return;
            }

            this.tabela.appendChild(produto.linha);
            this.idProduto++;
        } catch (erro) {
            console.error('Erro ao adicionar produto:', erro);
            alert('Não foi possível adicionar o produto. Verifique o console do navegador (F12).');
        } finally {
            botao.disabled = false;
        }
    }
}

class Produto {
    constructor(id, nome = '', quantidade = 0, unidade = 'UN', preco = 0) {
        this.id = id;
        this.idBanco = 0;
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
        id.textContent = this.id;

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

        [
            this.campoNome,
            this.campoQuantidade,
            this.campoUnidade,
            this.campoPreco
        ].forEach(campo => {
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
            this.status
        );
    }

    atualizarStatus() {
        const quantidade = Number(
            this.campoQuantidade?.value ?? this.quantidade
        );

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

    async salvar() {
        this.nome = this.campoNome.value.trim();
        this.quantidade = Number(this.campoQuantidade.value);
        this.unidade = this.campoUnidade.value;
        this.preco = Number(this.campoPreco.value);

        this.atualizarStatus();

        try {
            const novoId = await Registros.salvar(
                'estoque',
                this.idBanco,
                {
                    nome: this.nome,
                    quantidade: this.quantidade,
                    unidade: this.unidade,
                    preco: this.preco
                }
            );

            if (novoId && Number(novoId) > 0) {
                this.idBanco = Number(novoId);
            } else {
                console.error('O servidor não confirmou o salvamento do produto.');
            }
        } catch (erro) {
            console.error('Erro ao salvar produto:', erro);
            alert('Erro ao salvar o produto. Verifique a conexão com o servidor.');
        }
    }
}

new TabelaEstoque();
