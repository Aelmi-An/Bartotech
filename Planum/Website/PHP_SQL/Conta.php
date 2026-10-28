<?php
require 'Base.php';
//------->  Aqui eu tive que pesquisar como fazer, eu não sabia como fazer isso funcionar  <--------
$conexao = mysqli_connect('localhost', 'root', '', 'Bartotech');
$stmt = mysqli_prepare($conexao,
    "SELECT nome, email
     FROM cadastro
     WHERE id = ?");
mysqli_stmt_bind_param($stmt, 'i', $usuario_id);

if (!mysqli_stmt_execute($stmt)) {
    http_response_code(500);
    echo json_encode(['erro' => 'Não foi possível carregar os dados da conta']);
    exit;
}

$resultado = mysqli_stmt_get_result($stmt);
$conta = mysqli_fetch_assoc($resultado);

if (!$conta) {
    http_response_code(404);
    echo json_encode(['erro' => 'Conta não encontrada']);
    exit;
}

echo json_encode([
    'nome' => $conta['nome'],
    'email' => $conta['email']
], JSON_UNESCAPED_UNICODE);
