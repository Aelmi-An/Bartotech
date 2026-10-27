<?php
require  'Base.php';

// Só estas tabelas do site podem ser salvas
$permitidas = ['estoque', 'financas', 'vendas', 'marketing'];

$acao   = $_POST['acao'] ?? $_GET['acao'] ?? 'listar';
$tabela = $_POST['tabela'] ?? $_GET['tabela'] ?? '';

if (!in_array($tabela, $permitidas, true)) {
    http_response_code(400);
    echo json_encode(['erro' => 'Tabela inválida']);
    exit;
}

//  só os registros desta tabela que são da conta logada
if ($acao === 'listar') {
    $stmt = mysqli_prepare($conexao,
        "SELECT id, dados
         FROM registros
         WHERE usuario_id = ? AND tabela = ?
         ORDER BY id");
    mysqli_stmt_bind_param($stmt, 'is', $usuario_id, $tabela);
    mysqli_stmt_execute($stmt);
    $resultado = mysqli_stmt_get_result($stmt);

    $lista = [];
    while ($linha = mysqli_fetch_assoc($resultado)) {
        $lista[] = [
            'id'    => (int) $linha['id'],
            'dados' => json_decode($linha['dados'], true)
        ];
    }

    echo json_encode($lista);
    exit;
}

//  id = 0 cria um registro novo, id > 0 atualiza o existente
if ($acao === 'salvar') {
    $id    = (int) ($_POST['id'] ?? 0);
    $dados = json_decode($_POST['dados'] ?? '', true);

    if (!is_array($dados)) {
        http_response_code(400);
        echo json_encode(['erro' => 'Dados inválidos']);
        exit;
    }

    $json = json_encode($dados, JSON_UNESCAPED_UNICODE);

    if ($id === 0) {
        $stmt = mysqli_prepare($conexao,
            "INSERT INTO registros (usuario_id, tabela, dados)
             VALUES (?, ?, ?)");
        mysqli_stmt_bind_param($stmt, 'iss', $usuario_id, $tabela, $json);
        mysqli_stmt_execute($stmt);

        echo json_encode(['id' => mysqli_insert_id($conexao)]);
    } else {
        // O "AND usuario_id = ?" impede mexer no registro de outra conta
        $stmt = mysqli_prepare($conexao,
            "UPDATE registros
             SET dados = ?
             WHERE id = ? AND usuario_id = ? AND tabela = ?");
        mysqli_stmt_bind_param($stmt, 'siis', $json, $id, $usuario_id, $tabela);
        mysqli_stmt_execute($stmt);

        echo json_encode(['id' => $id]);
    }
    exit;
}

http_response_code(400);
echo json_encode(['erro' => 'Ação inválida']);
