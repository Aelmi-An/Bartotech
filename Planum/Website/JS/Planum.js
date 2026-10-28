class Tema {
    constructor() {
        this.opcoes = document.querySelectorAll('input[name="tema"]');
        this.carregarTema();
    }

    carregarTema() {
        let tema = 'claro';

        try {
            tema = localStorage.getItem('planum-tema') || 'claro';
        } catch (erro) {
            tema = 'claro';
        }

        document.body.classList.toggle('escuro', tema === 'escuro');

        this.opcoes.forEach(opcao => {
            opcao.checked = opcao.value === tema;

            opcao.addEventListener('change', () => {
                let temaEscolhido = opcao.value;

                document.body.classList.toggle('escuro', temaEscolhido === 'escuro');

                try {
                    localStorage.setItem('planum-tema', temaEscolhido);
                } catch (erro) {
                    // O tema continua funcionando mesmo se o navegador bloquear o armazenamento.
                }
            });
        });
    }
}



class FiltroTabela {
    constructor(secao) {
        this.secao = secao;
        this.campoBusca = secao.querySelector('.busca');
        this.linhas = secao.querySelectorAll('.linha_Grid');
        this.ramoAtual = 'todos';

        this.iniciar();
    }

    iniciar() {
        if (this.campo) {
            this.campo.addEventListener('input', () => {
                this.filtrar();
            });
        }

        let botoes = this.secao.querySelectorAll('.abas button');

        botoes.forEach(botao => {
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
        this.atualizarSituacao();
    }

    atualizarSituacao() {
        this.produtos.forEach(produto => {
            let quantidade = Number(produto.dataset.qtd);

            produto.classList.remove('baixo', 'critico');

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
            throw new Error('Não é possível dividir por zero.');
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
        if (!this.painel || !this.visor) {
            return;
        }

        document.querySelectorAll('.abrir-calc').forEach(botao => {
            botao.addEventListener('click', () => {
                this.painel.hidden = false;
            });
        });

        let botaoFechar = document.getElementById('fechar-calc');

        if (botaoFechar) {
            botaoFechar.addEventListener('click', () => {
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
        let simbolo = this.operacao === '*' ? '×' : this.operacao;
        let conta = this.anterior.replace('.', ',');
        let numero = this.atual.replace('.', ',');

        if (this.contaAnterior) {
            this.contaAnterior.textContent = conta;
        }

        this.visor.textContent = (simbolo + numero) || '0';
    }

    calcular() {
        if (this.operacao === '' || this.atual === '' || this.anterior === '') {
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
                this.atual = '';
                this.anterior = '';
                this.operacao = '';

                if (this.contaAnterior) {
                    this.contaAnterior.textContent = '';
                }

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
            this.terminou = false;
        } else if (tecla === 'CE') {
            this.atual = '';
        } else if (tecla === '=') {
            this.calcular();
            return;
        } else if ('+-*/'.includes(tecla)) {
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
        } else {
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
        let nomeSecao = window.location.hash.slice(1) || 'tabelas';
        let secaoExiste = document.getElementById(nomeSecao);

        if (!secaoExiste) {
            nomeSecao = 'tabelas';
        }

        this.secoes.forEach(secao => {
            secao.hidden = secao.id !== nomeSecao;
        });

        document.querySelectorAll('.Menu nav a').forEach(link => {
            link.removeAttribute('aria-current');

            if (link.getAttribute('href') === 'Tabelas.html#' + nomeSecao) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }
}


class MinhaConta {
    constructor() {
        this.carregarDados();
    }

    async carregarDados() {
        try {
            const resposta = await fetch('../PHP_SQL/Conta.php');
            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.erro || 'Não foi possível carregar os dados da conta.');
            }

            this.aplicarDados(resultado.nome, resultado.email);
        } catch (erro) {
            alert(erro.message || 'Não foi possível carregar os dados da conta.');
        }
    }

    aplicarDados(nome, email) {
        document.querySelectorAll('[data-conta="nome"]').forEach(campo => {
            campo.textContent = nome;
        });

        document.querySelectorAll('[data-conta="email"]').forEach(campo => {
            campo.textContent = email;
        });
    }
}


new Tema();
new MinhaConta();

document.querySelectorAll('.secao').forEach(secao => {
    new FiltroTabela(secao);
});

new Estoque();
new CalculadoraUI();
new Navegacao();
