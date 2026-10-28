
class TabelaMarketing {
    constructor() {
        this.tabela = document.querySelector('#marketing .Caixa');
        this.botaoNovo = document.getElementById('NovaCampanha');

        this.iniciar();
    }

    iniciar() {
        // ao abrir a página, busca as campanhas salvas no banco
        this.carregar();

        this.botaoNovo.addEventListener('click', () => {this.adicionar(); console.log("Tô conectado");
        });
    }

    //  desenha cada campanha que veio do banco (tive que pesquisar como faz, não é um codigo codigo inteiramente meu.)
    async carregar() {
        const lista = await Registros.listar('marketing');

        lista.forEach(item => {
            const d = item.dados;
            const marketar = new Marketing(d.campanha, d.plataforma, d.data, d.status);

            marketar.idBanco = item.id;

            this.tabela.appendChild(marketar.marketear);
        });
    }

    async adicionar() {
        const marketar = new Marketing();

        // cria a campanha no banco antes de mostrar a linha
        await marketar.salvar();

        if (marketar.idBanco === 0) {
            return; // não salvou, então não mostra a linha
        }

        this.tabela.appendChild(marketar.marketear);
    }
}

class Marketing {
    constructor(Camp = '',Plat = '',Data = '',Status = 'Em Planejamento') {
        this.idBanco = 0;
        this.Camp = Camp;
        this.Plat = Plat;
        this.Data = Data;
        this.Status = Status;

        this.criarLinha();
    }

    criarCelula(umaarea) {
        const celula = document.createElement('div');
        celula.appendChild(umaarea);
        return celula;
    }

    criarLinha() {
        this.marketear = document.createElement('div');
        this.marketear.classList.add('linha_Grid', 'Col5');

        this.campoCamp = document.createElement('input');
        this.campoCamp.type = 'text';
        this.campoCamp.placeholder = 'Campanha de Venda';
        this.campoCamp.value = this.Camp;

        this.campoPlat = document.createElement('input');
        this.campoPlat.type = 'text';
        this.campoPlat.placeholder = 'Plataforma de Divulgação';
        this.campoPlat.value = this.Plat;

        this.campoDatas = document.createElement('input');
        this.campoDatas.type = 'date';
        this.campoDatas.value = this.Data;

        this.campoStatuss = document.createElement('select');['Em andamento','Finalizada','Planejada','Em Planejamento'
        ].forEach(status => {
            const opcao = document.createElement('option');
            opcao.value = status;
            opcao.textContent = status;

            this.campoStatuss.appendChild(opcao);
        });

        this.campoStatuss.value = this.Status;

        this.marketear.append(
            this.criarCelula(this.campoCamp),
            this.criarCelula(this.campoPlat),
            this.criarCelula(this.campoDatas),
            this.criarCelula(this.campoStatuss),
            this.criarCelulaDeletar()
        );

        // ao terminar de editar um campo, salva no banco
        [
            this.campoCamp,
            this.campoPlat,
            this.campoDatas,
            this.campoStatuss
        ].forEach(campo => {
            campo.addEventListener('change', () => {
                this.salvar();
            });
        });
    }

    criarCelulaDeletar() {
        const celula = document.createElement('div');
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.classList.add('Botao_Sec');
        botao.textContent = 'Deletar';
        botao.addEventListener('click', async () => {
            if (await Registros.remover('marketing', this.idBanco)) {
                this.marketear.remove();
            }
        });
        celula.appendChild(botao);
        return celula;
    }

    // manda os dados para o banco
    async salvar() {
        this.Camp = this.campoCamp.value.trim();
        this.Plat = this.campoPlat.value.trim();
        this.Data = this.campoDatas.value;
        this.Status = this.campoStatuss.value;

        // idBanco 0 = cria uma campanha nova, maior que 0 = atualiza a que já existe
        const novoId = await Registros.salvar('marketing', this.idBanco, {
            campanha: this.Camp,
            plataforma: this.Plat,
            data: this.Data,
            status: this.Status
        });

        if (novoId !== 0) {
            this.idBanco = novoId;
        }
    }
}

new TabelaMarketing();
