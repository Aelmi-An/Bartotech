
class TabelaVendas {
    constructor() {
        this.tabela = document.querySelector('#vendas .Caixa');
        this.botaoNovo = document.getElementById('NovaVenda');
        this.idVenda = 1;

        this.iniciar();
    }

    iniciar() {
        // Ao abrir a página, carrega as vendas salvas
        this.carregar();

        this.botaoNovo.addEventListener('click', () => {
            this.adicionar();
        });
    }

    // Busca as vendas no banco e monta as linhas no HTML
    async carregar() {
        try {
            const lista = await Registros.listar('vendas');

            lista.forEach(item => {
                const d = item.dados;

                const venda = new Vendas(
                    this.idVenda,
                    d.produto ?? '',
                    d.cliente ?? '',
                    d.quantidade ?? 0,
                    d.valor ?? 0,
                    d.data ?? '',
                    d.status ?? 'Pendente'
                );

                // Guarda o ID verdadeiro do banco
                venda.idBanco = Number(item.id);

                this.tabela.appendChild(venda.vendas);
                this.idVenda++;
            });
        } catch (erro) {
            console.error('Erro ao carregar vendas:', erro);
        }
    }

    // Cria o registro no banco antes de mostrar a linha
    async adicionar() {
        const venda = new Vendas(this.idVenda);
        this.idVenda++;

        try {
            await venda.salvar();

            if (venda.idBanco === 0) {
                console.error('Não foi possível salvar a nova venda.');
                return;
            }

            this.tabela.appendChild(venda.vendas);
        } catch (erro) {
            console.error('Erro ao adicionar venda:', erro);
        }
    }
}


class Vendas {
    constructor(
        id,
        produto = '',
        cliente = '',
        quantia = 0,
        valor = 0,
        data = '',
        status = 'Pendente'
    ) {
        this.id = id;
        this.idBanco = 0;

        this.produto = produto;
        this.cliente = cliente;
        this.quantia = quantia;
        this.valor = valor;
        this.data = data;
        this.status = status;

        this.criarLinhas();
    }

    criarCelula(elemento) {
        const celula = document.createElement('div');
        celula.appendChild(elemento);
        return celula;
    }

    criarLinhas() {
        this.vendas = document.createElement('div');
        this.vendas.classList.add('linha_Grid', 'Col8');

        // ID visual da venda
        const id = document.createElement('div');
        id.textContent = String(this.id);

        // Produto
        this.campoProduto = document.createElement('input');
        this.campoProduto.type = 'text';
        this.campoProduto.placeholder = 'Produto';
        this.campoProduto.value = this.produto;

        // Cliente
        this.campoCliente = document.createElement('input');
        this.campoCliente.type = 'text';
        this.campoCliente.placeholder = 'Cliente';
        this.campoCliente.value = this.cliente;

        // Quantidade
        this.campoQuantia = document.createElement('input');
        this.campoQuantia.type = 'number';
        this.campoQuantia.min = '0';
        this.campoQuantia.value = this.quantia;

        // Valor
        this.campoValor = document.createElement('input');
        this.campoValor.type = 'number';
        this.campoValor.min = '0';
        this.campoValor.step = '0.01';
        this.campoValor.placeholder = '0,00';
        this.campoValor.value = this.valor;

        // Data
        this.campoData = document.createElement('input');
        this.campoData.type = 'date';
        this.campoData.value = this.data;

        // Status
        this.campoStatus = document.createElement('select');

        ['Efetuada', 'Em Andamento', 'Pendente'].forEach(status => {
            const opcao = document.createElement('option');
            opcao.value = status;
            opcao.textContent = status;
            this.campoStatus.appendChild(opcao);
        });

        this.campoStatus.value = this.status;

        // Monta a linha completa
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

        // Salva quando o usuário termina de editar
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

    // Botão para excluir a venda
    criarCelulaDeletar() {
        const celula = document.createElement('div');
        const botao = document.createElement('button');

        botao.type = 'button';
        botao.classList.add('Botao_Sec');
        botao.textContent = 'Deletar';

        botao.addEventListener('click', async () => {
            try {
                if (this.idBanco === 0) {
                    this.vendas.remove();
                    return;
                }

                const removido = await Registros.remover(
                    'vendas',
                    this.idBanco
                );

                if (removido) {
                    this.vendas.remove();
                }
            } catch (erro) {
                console.error('Erro ao excluir venda:', erro);
            }
        });

        celula.appendChild(botao);
        return celula;
    }

    // Salva uma venda nova ou atualiza uma existente
    async salvar() {
        this.produto = this.campoProduto.value.trim();
        this.cliente = this.campoCliente.value.trim();
        this.quantia = Number(this.campoQuantia.value);
        this.valor = Number(this.campoValor.value);
        this.data = this.campoData.value;
        this.status = this.campoStatus.value;

        const novoId = await Registros.salvar(
            'vendas',
            this.idBanco,
            {
                produto: this.produto,
                cliente: this.cliente,
                quantidade: this.quantia,
                valor: this.valor,
                data: this.data,
                status: this.status
            }
        );

        if (novoId && novoId !== 0) {
            this.idBanco = Number(novoId);
        }

        return this.idBanco;
    }
}


// Inicializa a tabela depois que o HTML estiver disponível
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TabelaVendas();
    });
} else {
    new TabelaVendas();
}
