<?php

$conexão = mysqli_connect('localhost', 'root', '', 'Bartotech');

$N_nome = $_POST['N_nome'];
$N_email = $_POST['N_email'];
$N_senha = $_POST['N_senha'];

if (!$conexão) {
    die("Erro na conexão :(");
}

// Procura uma conta com os mesmos dados
$sql = "SELECT * FROM cadastro 
        WHERE email = '$N_email' 
        AND nome = '$N_nome' 
        AND senha = '$N_senha'";

$resultado = mysqli_query($conexão, $sql);

if (mysqli_num_rows($resultado) > 0) {

    header("Location: ../HTML/Criar_Conta.html?erro=1");
    exit;

} else {

    $sql = "INSERT INTO cadastro(email, senha, nome)
            VALUES ('$N_email', '$N_senha', '$N_nome')";

    mysqli_query($conexão, $sql);

   header("Location: ../../Website/HTML/Transicao.html");
}

?>