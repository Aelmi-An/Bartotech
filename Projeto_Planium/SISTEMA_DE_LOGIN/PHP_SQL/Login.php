<?php
$conexão=mysqli_connect('localhost','root','','Bartotech');

$email=$_POST['email'];
$senha=$_POST['senha'];

if(!$conexão){
    die("Erro na conexão :(");
}

$sql = "SELECT * FROM cadastro WHERE email = '$email' AND senha = '$senha'";
$resultado = mysqli_query($conexão, $sql);

//resumidamente é um sistema de erros
   //testa se há 1 ou mais "contas" com esse email/senha
if (mysqli_num_rows($resultado) > 0) {
    header("Location: painel.html"); 
} else {
    //Caso o email/senha não exista, imprime erro na url
   header("Location: ../HTML/Tela_de_Início.html?erro=1");
    exit;
}
?>