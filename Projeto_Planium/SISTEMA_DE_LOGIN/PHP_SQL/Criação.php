<?php
$conexão=mysqli_connect('localhost','root','','Bartotech');

$N_nome=$_POST['N_nome'];
$N_email=$_POST['N_email'];
$N_senha=$_POST['N_senha'];

if(!$conexão){
    die("Erro na conexão :(");
}

mysqli_query(
$conexão, "insert into cadastro(email,senha,nome)
values ('$N_email','$N_senha','$N_nome')"
);

header("Location: ../HTML/Tela_de_Início.html");
exit;
?>