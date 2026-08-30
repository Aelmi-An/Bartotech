 function Limpar(){
document.getElementById("email").value='';
document.getElementById("senha").value='';
 }
  //Analisa a url do site
const url = new URLSearchParams(window.location.search);
  // Se ele achar a palavra "erro" lá na url (causada pelo php)..
 if (url.has('erro')) {
    document.getElementById('Mensagem_de_Erro').innerText = "Erro de login: E-mail ou Senha incorretos!";
  }

