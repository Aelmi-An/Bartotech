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
        if (this.campoBusca) {
            this.campoBusca.addEventListener('input', () => {
                this.filtrar();
            });
        }

        let botoes = this.secao.querySelectorAll('.abas button');

        botoes.forEach(botao => {
            botao.addEventListener('click', () => {
                let abaAtiva = this.secao.querySelector('.abas .ativa');

                if (abaAtiva) {
                    abaAtiva.classList.remove('ativa');
                }

                botao.classList.add('ativa');
                this.ramoAtual = botao.dataset.ramo || 'todos';

                this.filtrar();
            });
        });
    }

    filtrar() {
        let texto = '';

        if (this.campoBusca) {
            texto = this.campoBusca.value.trim().toLowerCase();
        }

        this.linhas.forEach(linha => {
            let conteudo = linha.textContent.toLowerCase();
            let encontrouTexto = conteudo.includes(texto);
            let encontrouRamo = this.ramoAtual === 'todos' ||
                linha.dataset.ramo === this.ramoAtual;

            let esconder = !(encontrouTexto && encontrouRamo);

            linha.hidden = esconder;

            let acoes = linha.nextElementSibling;

            if (acoes && acoes.classList.contains('linha-acoes')) {
                acoes.hidden = esconder;
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
        this.form = document.getElementById('form-conta');
        this.botaoEditar = document.getElementById('editar-conta');
        this.botaoCancelar = document.getElementById('cancelar-conta');
        this.campoNome = document.getElementById('nome-conta');
        this.campoEmail = document.getElementById('email-conta');

        this.mostrarDados();

        if (!this.form || !this.botaoEditar || !this.botaoCancelar ||
            !this.campoNome || !this.campoEmail) {
            return;
        }

        this.iniciar();
    }

    iniciar() {
        this.botaoEditar.addEventListener('click', () => {
            this.campoNome.value = this.lerDado('planum-nome');
            this.campoEmail.value = this.lerDado('planum-email');

            this.form.hidden = false;
            this.botaoEditar.hidden = true;
            this.campoNome.focus();
        });

        this.botaoCancelar.addEventListener('click', () => {
            this.form.reset();
            this.form.hidden = true;
            this.botaoEditar.hidden = false;
        });

        this.form.addEventListener('submit', evento => {
            evento.preventDefault();

            let nome = this.campoNome.value.trim();
            let email = this.campoEmail.value.trim();

            if (nome === '' || email === '') {
                return;
            }

            try {
                localStorage.setItem('planum-nome', nome);
                localStorage.setItem('planum-email', email);
            } catch (erro) {
                alert('Não foi possível salvar os dados neste navegador.');
                return;
            }

            this.mostrarDados();
            this.form.hidden = true;
            this.botaoEditar.hidden = false;
        });
    }

    lerDado(chave) {
        try {
            return localStorage.getItem(chave) || '';
        } catch (erro) {
            return '';
        }
    }

    mostrarDados() {
        let nome = this.lerDado('planum-nome');
        let email = this.lerDado('planum-email');

        if (nome) {
            document.querySelectorAll('[data-conta="nome"]').forEach(campo => {
                campo.textContent = nome;
            });
        }

        if (email) {
            document.querySelectorAll('[data-conta="email"]').forEach(campo => {
                campo.textContent = email;
            });
        }
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
