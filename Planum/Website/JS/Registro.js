// Conversa com o PHP. Todas as tabelas usam estas duas funções.
const Registros = {
    url: '../PHP_SQL/Registros.php',

    // Busca no banco os registros desta tabela que são da conta logada
    async listar(tabela) {
        const resposta = await fetch(this.url + '?acao=listar&tabela=' + tabela);

        if (!resposta.ok) {
            return []; // 401 = não está logado
        }

        return await resposta.json();
    },

    // id 0 cria um registro novo; id maior que 0 atualiza.
    // Devolve o id do registro no banco, ou 0 se não conseguiu salvar.
    async salvar(tabela, id, dados) {
        const form = new FormData();
        form.append('acao', 'salvar');
        form.append('tabela', tabela);
        form.append('id', id);
        form.append('dados', JSON.stringify(dados));

        const resposta = await fetch(this.url, {
            method: 'POST',
            body: form
        });

        if (!resposta.ok) {
            alert('Não foi possível salvar. Entre na sua conta novamente.');
            return 0;
        }

        const resultado = await resposta.json();
        return Number(resultado.id);
    },

    // apaga o registro do banco, devolve true se deu certo
    async excluir(tabela, id) {
        const form = new FormData();
        form.append('acao', 'excluir');
        form.append('tabela', tabela);
        form.append('id', id);

        const resposta = await fetch(this.url, {
            method: 'POST',
            body: form
        });

        if (!resposta.ok) {
            alert('Não foi possível apagar. Entre na sua conta novamente.');
            return false;
        }

        return true;
    },

    // cria o botão × da linha, cada tabela chama isso na hora de montar a linha
    botaoApagar(tabela, item, linha) {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'apagar';
        botao.title = 'Apagar linha';
        botao.textContent = '×';

        botao.addEventListener('click', async () => {
            // se a linha ainda não foi pro banco, não tem o que apagar
            if (!item.idBanco) {
                return;
            }

            // pergunta antes, porque depois de apagar não volta
            if (!confirm('Quer mesmo apagar esta linha?')) {
                return;
            }

            const apagou = await this.excluir(tabela, item.idBanco);

            if (apagou) {
                linha.remove();
            }
        });

        return botao;
    }
};