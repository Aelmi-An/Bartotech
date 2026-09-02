 function Limpar_Login(){
let email = document.getElementById("email").value='';
let senha = document.getElementById("senha").value='';
 }

  function Limpar_Criação(){
let nome = document.getElementById("N_nome").value='';
let email = document.getElementById("N_email").value='';
let senha = document.getElementById("N_senha").value='';
 }

const url = new URLSearchParams(window.location.search);

 if (url.has('erro')) {
    document.getElementById('Mensagem_de_Erro').innerText = "Erro de login: E-mail ou Senha incorretos!";
  }

