const html = document.querySelector('html');

const iniciar = document.querySelector('.app__card-primary-button');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');

const timer = document.querySelector('#timer');
const image = document.querySelector('.app__image');
const title = document.querySelector('.app__title');

const buttons = document.querySelectorAll('.app__card-button');
const musicaInput = document.querySelector('#alternar-musica');
const musica = new Audio('./sons/luna-rise-part-one.mp3');
const som_beep = new Audio('./sons/beep.mp3');
const som_pause = new Audio('./sons/pause.mp3');
const som_play = new Audio('./sons/play.wav');
musica.loop = true;
const comecar = document.getElementById('start-pause');
comecar.setAttribute('disabled','disabled');
const iniciar_pausar = document.querySelector('#start-pause span');
const iconBtComecar = document.querySelector('.app__card-primary-butto-icon');
const tempoFoco = 1500;
const tempoCurto = 300;
const tempoLongo = 900;

let duracao = tempoFoco;
exibirDuracao(duracao); 

let interval = null;

// const item1 = document.querySelector('li:first-child');
// const item2 = item1.nextElementSibling;
// console.log(item1);
// console.log(item2); // Saída: "Item 2"

//const childnodes = comecar.childNodes;
//console.log(childnodes);
//console.log(childnodes[0]);

musicaInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

focoBt.addEventListener('click', () => {
    alterarContexto('foco');
    focoBt.classList.add('active');
});

curtoBt.addEventListener('click', () => {
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
    comecar.removeAttribute('disabled');
});

longoBt.addEventListener('click', () => {
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
    comecar.removeAttribute('disabled');
});

comecar.addEventListener('click', () => {
    if (interval) {
        som_pause.play();
        pausar();
        return;
    }
    som_play.play();    
    iniciar_pausar.textContent = `Pausar`;
    iconBtComecar.setAttribute('src',`/imagens/pause.png`);
    interval = setInterval(decresce,1000);
});

function alterarContexto(contexto) {
    html.setAttribute('data-contexto', contexto);
    image.setAttribute('src',`/imagens/${contexto}.png`);
    buttons.forEach(function (classe) {
        if (classe.classList.contains('active')) {
            classe.classList.remove('active');
        }
    })
    switch (contexto) {
        case 'foco':
            title.innerHTML = `
                Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `;
            exibirDuracao(tempoFoco);
            duracao = tempoFoco;
            break;        
        case 'descanso-curto':
            title.innerHTML = `
                Que tal dar uma respirada,<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `;
            exibirDuracao(tempoCurto);
            duracao = tempoCurto;
            break;
        case 'descanso-longo':
            title.innerHTML = `
                Hora de voltar à superficie,<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `;
            exibirDuracao(tempoLongo);
            duracao = tempoLongo;
            break;
    }

}

const pausar = () => {
    iniciar_pausar.textContent = `Começar`;
    iconBtComecar.setAttribute('src',`/imagens/play_arrow.png`);
    clearInterval(interval);
    interval = null;
}

const decresce = () => {
    exibirDuracao(duracao);
    if (duracao <= 0) {
        som_beep.play();
  //      alert('Finalizado');
        finalizar();
        pausar();
        duracao = 10;
        return;
    }    
    duracao -= 1;
}

function exibirDuracao(tempo) {
    tempo = new Date(tempo * 1000);
    timer.innerHTML = `${tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'})}`;
}


function finalizar() {
    const focoAtivo = html.getAttribute('data-contexto') == 'foco';
    if (focoAtivo) {
        const evento = new CustomEvent('FocoFinalizado');
        document.dispatchEvent(evento);
    }
} 
