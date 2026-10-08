class Tema {
    constructor() {
        this.opcoes = document.querySelectorAll('input[name="tema"]');
        this.iniciar();
    }

    iniciar() {
        let tema = 'claro';

        try {
            tema = localStorage.getItem('planum-tema') || 'claro';
        } catch (erro) {}

        document.body.classList.toggle('escuro', tema === 'escuro');

        this.opcoes.forEach(opcao => {
            opcao.checked = opcao.value === tema;

            opcao.addEventListener('change', () => {
                document.body.classList.toggle('escuro', opcao.value === 'escuro');

                try {
                    localStorage.setItem('planum-tema', opcao.value);
                } catch (erro) {}
            });
        });
    }
}


class FiltroTabela {
    constructor(secao) {
        this.secao = secao;
        this.campo = secao.querySelector('.busca');
        this.linhas = secao.querySelectorAll('.linha_Grid');
        this.ramo = 'todos';

        this.iniciar();
    }

    iniciar() {
        if (this.campo) {
            this.campo.addEventListener('input', () => {
                this.filtrar();
            });
        }

        this.secao.querySelectorAll('.abas button').forEach(botao => {
            botao.addEventListener('click', () => {
                this.secao.querySelector('.abas .ativa').classList.remove('ativa');

                botao.classList.add('ativa');

                this.ramo = botao.dataset.ramo;

                this.filtrar();
            });
        });
    }

    filtrar() {
        let texto = '';

        if (this.campo) {
            texto = this.campo.value.toLowerCase();
        }

        this.linhas.forEach(linha => {
            let textoLinha = linha.textContent.toLowerCase();

            let achouTexto = textoLinha.includes(texto);
            let achouRamo = this.ramo === 'todos' || linha.dataset.ramo === this.ramo;

            if (achouTexto && achouRamo) {
                linha.hidden = false;
            } else {
                linha.hidden = true;
            }
        });
    }
}


class Estoque {
    constructor() {
        this.produtos = document.querySelectorAll('.situacao');
        this.verificar();
    }

    verificar() {
        this.produtos.forEach(produto => {
            let quantidade = Number(produto.dataset.qtd);

            if (quantidade > 10) {
                produto.textContent = 'Normal';
            } else if (quantidade >= 5) {
                produto.textContent = 'Baixo';
                produto.classList.add('baixo');
            } else {
                produto.textContent = 'Crítico';
                produto.classList.add('critico');
            }
        });
    }
}


class Calculadora {
    somar(a, b) {
        return a + b;
    }

    subtrair(a, b) {
        return a - b;
    }

    multiplicar(a, b) {
        return a * b;
    }

    dividir(a, b) {
        if (b === 0) {
            throw new Error("Divisão por zero não é permitida");
        }

        return a / b;
    }
}


class CalculadoraUI {
    constructor() {
        this.calculadora = new Calculadora();

        this.atual = '';
        this.anterior = '';
        this.operacao = '';
        this.terminou = false;

        this.painel = document.getElementById('calc');
        this.visor = document.getElementById('visor');
        this.contaAnterior = document.getElementById('conta-anterior');

        this.iniciar();
    }

    iniciar() {
        if (!this.painel) {
            return;
        }

        document.querySelectorAll('.abrir-calc').forEach(botao => {
            botao.addEventListener('click', () => {
                this.painel.hidden = false;
            });
        });

        let fechar = document.getElementById('fechar-calc');

        if (fechar) {
            fechar.addEventListener('click', () => {
                this.painel.hidden = true;
            });
        }

        this.painel.querySelectorAll('[data-tecla]').forEach(botao => {
            botao.addEventListener('click', () => {
                this.apertar(botao.dataset.tecla);
            });
        });
    }

    mostrar() {
        let simbolo = this.operacao;

        if (simbolo === '*') {
            simbolo = '×';
        }

        let conta = this.anterior.replace('.', ',');
        let numero = this.atual.replace('.', ',');

        this.contaAnterior.textContent = conta;
        this.visor.textContent = simbolo + numero;

        if (this.visor.textContent === '') {
            this.visor.textContent = '0';
        }
    }

    calcular() {
        if (this.operacao === '' || this.atual === '') {
            return;
        }

        let a = Number(this.anterior);
        let b = Number(this.atual);
        let resultado;

        if (this.operacao === '+') {
            resultado = this.calculadora.somar(a, b);
        } else if (this.operacao === '-') {
            resultado = this.calculadora.subtrair(a, b);
        } else if (this.operacao === '*') {
            resultado = this.calculadora.multiplicar(a, b);
        } else if (this.operacao === '/') {
            try {
                resultado = this.calculadora.dividir(a, b);
            } catch (erro) {
                this.visor.textContent = 'Erro';
                this.contaAnterior.textContent = '';
                this.atual = '';
                this.anterior = '';
                this.operacao = '';
                return;
            }
        }

        this.atual = String(Math.round(resultado * 100000000) / 100000000);

        this.anterior = '';
        this.operacao = '';
        this.terminou = true;

        this.mostrar();
    }

    apertar(tecla) {

        if (tecla === 'C') {
            this.atual = '';
            this.anterior = '';
            this.operacao = '';
        }

        else if (tecla === 'CE') {
            this.atual = '';
        }

        else if (tecla === '=') {
            this.calcular();
            return;
        }

        else if ('+-*/'.includes(tecla)) {

            if (this.atual === '' && this.anterior === '') {
                return;
            }

            if (this.atual !== '') {

                if (this.operacao !== '') {
                    this.calcular();
                }

                this.anterior = this.atual;
                this.atual = '';
            }

            this.operacao = tecla;
            this.terminou = false;
        }

        else {

            if (tecla === ',') {
                tecla = '.';
            }

            if (tecla === '.' && this.atual.includes('.')) {
                return;
            }

            if (this.terminou) {
                this.atual = '';
                this.terminou = false;
            }

            if (tecla === '.' && this.atual === '') {
                this.atual = '0';
            }

            this.atual += tecla;
        }

        this.mostrar();
    }
}


class Navegacao {
    constructor() {
        this.secoes = document.querySelectorAll('.secao');

        if (this.secoes.length > 1) {
            this.iniciar();
        }
    }

    iniciar() {
        window.addEventListener('hashchange', () => {
            this.mostrar();
        });

        this.mostrar();
    }

    mostrar() {
        let nome = window.location.hash.replace('#', '');

        if (nome === '') {
            nome = 'tabelas';
        }

        let secao = document.getElementById(nome);

        if (!secao) {
            nome = 'tabelas';
        }

        this.secoes.forEach(secao => {
            secao.hidden = secao.id !== nome;
        });

        document.querySelectorAll('.menu nav a').forEach(link => {
            link.removeAttribute('aria-current');

            if (link.getAttribute('href') === 'Tabelas.html#' + nome) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }
}


new Tema();

document.querySelectorAll('.secao').forEach(secao => {
    new FiltroTabela(secao);
});

new Estoque();
new CalculadoraUI();
new Navegacao();
