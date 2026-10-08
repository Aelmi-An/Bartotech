// Tema claro/escuro
let tema = 'claro';
try {
    tema = localStorage.getItem('planum-tema') || 'claro';
} catch (erro) {}
document.body.classList.toggle('escuro', tema === 'escuro');

document.querySelectorAll('input[name="tema"]').forEach(opcao => {
    opcao.checked = opcao.value === tema;

    opcao.addEventListener('change', () => {
        document.body.classList.toggle('escuro', opcao.value === 'escuro');
        try {
            localStorage.setItem('planum-tema', opcao.value);
        } catch (erro) {}
    });
});


// Busca e abas (cada seção filtra a própria tabela)
function filtrar(secao) {
    const campo = secao.querySelector('.busca');
    const aba = secao.querySelector('.abas .ativa');

    const texto = campo ? campo.value.toLowerCase() : '';
    const ramo = aba ? aba.dataset.ramo : 'todos';

    secao.querySelectorAll('.linha_Grid').forEach(linha => {
        const achouTexto = linha.textContent.toLowerCase().includes(texto);
        const achouRamo = ramo === 'todos' || linha.dataset.ramo === ramo;

        linha.hidden = !(achouTexto && achouRamo);
    });
}

document.querySelectorAll('.secao').forEach(secao => {
    const campo = secao.querySelector('.busca');
    if (campo) campo.addEventListener('input', () => filtrar(secao));

    secao.querySelectorAll('.abas button').forEach(botao => {
        botao.addEventListener('click', () => {
            secao.querySelector('.abas .ativa').classList.remove('ativa');
            botao.classList.add('ativa');
            filtrar(secao);
        });
    });
});


// Situação do estoque (mais de 10 normal, de 5 a 10 baixo, menos de 5 crítico)
document.querySelectorAll('.situacao').forEach(celula => {
    const qtd = Number(celula.dataset.qtd);

    if (qtd > 10) {
        celula.textContent = 'Normal';
    } else if (qtd >= 5) {
        celula.textContent = 'Baixo';
        celula.classList.add('baixo');
    } else {
        celula.textContent = 'Crítico';
        celula.classList.add('critico');
    }
});


// Calculadora
let atual = '';
let anterior = '';
let op = '';
let acabou = false;

function mostrar() {
    const simbolo = op === '*' ? '×' : op;

    document.getElementById('conta-anterior').textContent = anterior.replace('.', ',');
    document.getElementById('visor').textContent = (simbolo + atual || '0').replace('.', ',');
}

function calcular() {
    if (op === '' || atual === '') return;

    const a = Number(anterior);
    const b = Number(atual);
    let resultado;

    if (op === '+') resultado = a + b;
    if (op === '-') resultado = a - b;
    if (op === '*') resultado = a * b;
    if (op === '/') resultado = a / b;

    // divisão por zero cai aqui
    if (!isFinite(resultado)) {
        atual = '';
        anterior = '';
        op = '';
        document.getElementById('conta-anterior').textContent = '';
        document.getElementById('visor').textContent = 'Erro';
        return;
    }

    atual = String(Math.round(resultado * 100000000) / 100000000);
    anterior = '';
    op = '';
    acabou = true;
    mostrar();
}

function apertar(tecla) {
    if (tecla === 'C') {
        atual = '';
        anterior = '';
        op = '';
    } else if (tecla === 'CE') {
        atual = '';
    } else if (tecla === '=') {
        calcular();
        return;
    } else if ('+-*/'.includes(tecla)) {
        if (atual === '' && anterior === '') return;

        if (atual !== '') {
            if (op !== '') calcular();
            anterior = atual;
            atual = '';
        }
        op = tecla;
        acabou = false;
    } else {
        if (tecla === ',') tecla = '.';
        if (tecla === '.' && atual.includes('.')) return;

        if (acabou) {
            atual = '';
            acabou = false;
        }
        if (tecla === '.' && atual === '') atual = '0';
        atual += tecla;
    }

    mostrar();
}

const painel = document.getElementById('calc');

if (painel) {
    document.querySelectorAll('.abrir-calc').forEach(botao => {
        botao.addEventListener('click', () => painel.hidden = false);
    });

    document.getElementById('fechar-calc').addEventListener('click', () => painel.hidden = true);

    painel.querySelectorAll('[data-tecla]').forEach(botao => {
        botao.addEventListener('click', () => apertar(botao.dataset.tecla));
    });
}



// Troca de seção dentro da página Tabelas (Tabelas.html#vendas, #estoque...)
function mostrarSecao() {
    const secoes = document.querySelectorAll('.secao');

    // Início e Configurações só têm uma seção
    if (secoes.length < 2) return;

    let nome = window.location.hash.replace('#', '') || 'tabelas';
    if (!document.getElementById(nome)) nome = 'tabelas';

    secoes.forEach(secao => {
        secao.hidden = secao.id !== nome;
    });

    document.querySelectorAll('.Menu nav a').forEach(link => link.removeAttribute('aria-current'));
    document.querySelector('.Menu nav a[href="Tabelas.html#' + nome + '"]').setAttribute('aria-current', 'page');
}

window.addEventListener('hashchange', mostrarSecao);
mostrarSecao();
