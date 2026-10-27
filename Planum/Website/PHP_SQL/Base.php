<?php
//------->  Aqui eu tive que pesquisar como fazer, eu não sabia como fazer isso funcionar  <--------
// Garante que só quem está logado acessa, e descobre qual conta é.

session_start();
header('Content-Type: application/json; charset=utf-8');

if (empty($_SESSION['logado'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'Não logado']);
    exit;
}

// O id da conta vem da session no login.php.
$usuario_id = (int) $_SESSION['id'];

$conexao = mysqli_connect('localhost', 'root', '', 'Bartotech');

if (!$conexao) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro na conexão']);
    exit;
}

mysqli_set_charset($conexao, 'utf8mb4');
