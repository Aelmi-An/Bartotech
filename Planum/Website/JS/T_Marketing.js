
class TabelaMarketing {
    constructor() {
        this.tabela = document.querySelector('#marketing .Caixa');
        this.botaoNovo = document.getElementById('NovaCampanha');

        this.iniciar();
    }

    iniciar() {
        this.botaoNovo.addEventListener('click', () => {this.adicionar(); console.log("Tô conectado");
        });
    }

    adicionar() {
        const marketar = new Marketing();
        this.tabela.appendChild(marketar.marketear);
    }
}

class Marketing {
    constructor(Camp = '',Plat = '',Data = '',Status = 'Em Planejamento') {
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
        this.marketear.classList.add('linha_Grid', 'Col4');

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
            this.criarCelula(this.campoStatuss)
        );
    }
}

new TabelaMarketing();
