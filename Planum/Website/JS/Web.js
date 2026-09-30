const Planum = document.querySelector(".Grid");
const BtnNovoProd = document.getElementById("Novoproduto");
BtnNovoProd.addEventListener("click",function() {
    const N_Prod=document.createElement("div");
    N_Prod.classList.add("linha_Grid");
    Planum.appendChild(N_Prod);
});
