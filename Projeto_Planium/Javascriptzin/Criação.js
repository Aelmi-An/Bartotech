 function Limpar(){
document.getElementById("N_nome").value='';
document.getElementById("N_email").value='';
document.getElementById("N_senha").value='';
 }
 const url = new URLSearchParams(window.location.search);
 if (url.has('ok')) {
    document.getElementById('Mensagem_Sucesso').innerText = "Login efetuado com sucesso!";
  }