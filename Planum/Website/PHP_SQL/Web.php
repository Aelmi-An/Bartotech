<?php
session_start();
if(!isset($_SESSION['logado'])){
    header("Location: ../../Login/HTML/Tela_de_Início.html?erro=1");
}
else{
    
}
?>