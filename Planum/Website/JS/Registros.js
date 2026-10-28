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

    async remover(tabela, id) {
        const form = new FormData();
        form.append('acao', 'deletar');
        form.append('tabela', tabela);
        form.append('id', id);

        let resposta;
        try {
            resposta = await fetch(this.url, {
                method: 'POST',
                body: form
            });
        } catch (erro) {
            alert('Falha de comunicação ao deletar o registro.');
            return false;
        }

        let resultado;
        try {
            resultado = await resposta.json();
        } catch (erro) {
            alert('O servidor retornou uma resposta inválida ao deletar.');
            return false;
        }

        if (!resposta.ok || resultado.sucesso !== true) {
            alert(resultado.erro || 'Não foi possível deletar o registro.');
            return false;
        }

        return true;
    }
};
