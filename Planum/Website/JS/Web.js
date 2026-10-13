const Planum = document.querySelector(".Grid");
const BtnNovoProd = document.getElementById("Novoproduto");

let idProduto = 1;

BtnNovoProd.addEventListener("click", function () {
    const novaLinha = document.createElement("div");
    novaLinha.classList.add("linha_Grid");

    const id = document.createElement("div");
    id.textContent = String(idProduto).padStart(1, "0");

    const produto = document.createElement("input");
    produto.type = "text";
    produto.placeholder = "Nome do produto";

    const quantidade = document.createElement("input");
    quantidade.type = "number";
    quantidade.value = "0";

    const unidade = document.createElement("select");

    const unidadesdimedida = ["G", "KG", "ML", "L"];

    unidadesdimedida.forEach(function (item) {
        const opcao = document.createElement("option");
        opcao.value = item;
        opcao.textContent = item;
        unidade.appendChild(opcao);
    });

    const preco = document.createElement("input");
    preco.type = "number";
    preco.value = "0.00";
    preco.step = "0.01";

    const status = document.createElement("div");

    function atualizarStatus() {
    const quantidadeAtual = Number(quantidade.value);

    if (quantidadeAtual <= 0) {
        status.textContent = "Sem estoque";
    } else if (quantidadeAtual <= 2) {
        status.textContent = "Crítico";
    } else if (quantidadeAtual <= 8) {
        status.textContent = "Baixo";
    } else {
        status.textContent = "Normal";
    }
    }

    quantidade.addEventListener("input", atualizarStatus);

    atualizarStatus();
    
    novaLinha.append(
        id,
        produto,
        quantidade,
        unidade,
        preco,
        status
    );

    Planum.appendChild(novaLinha);

    idProduto++;
});