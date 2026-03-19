const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
const tarefaEmAndamento = document.querySelector('.app__section-active-task-description');
const removeTarefasConcluidas = document.querySelector('#btn-remove-concluidas');
const removeTodasTarefas = document.getElementById('btn-remove-todas');
const limpaTarefasConcluidas = document.getElementById('btn-limpa-concluidas');
let btDelete = formAdicionarTarefa.querySelector('.app__form-footer__button--delete');
let btCancel = formAdicionarTarefa.querySelector('.app__form-footer__button--cancel');
let tarefaSelecionada = null;
let liTarefaSelecionada = null;
let isFormActive = null;

function atualizaTarefa() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg');
    svg.innerHTML = `
            <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
                <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
            </svg>
    `;
    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description'); 
    paragrafo.textContent = tarefa.descricao;

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');
    botao.onclick = () => {
        //debugger;
        const novaTarefa = prompt("Qual é o nome da nova tarefa?", paragrafo.textContent);
        if (novaTarefa) {
            paragrafo.textContent = novaTarefa;
            tarefa.descricao = novaTarefa;
            atualizaTarefa();
        }
    }

    const imagembotao = document.createElement('img');
    imagembotao.setAttribute('src','/imagens/edit.png');
    botao.append(imagembotao);
    
    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled',true);
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active').forEach(element => {
                element.classList.remove('app__section-task-list-item-active');
            });

            document.getElementById('start-pause').setAttribute('disabled','disabled');

            if (tarefa == tarefaSelecionada) {
                li.classList.remove('app__section-task-list-item-active');
                tarefaEmAndamento.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
            }
            li.classList.add('app__section-task-list-item-active');
            tarefaEmAndamento.textContent = tarefa.descricao;
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            document.getElementById('start-pause').removeAttribute('disabled');
        }
    }
    return li;
}

btnAdicionarTarefa.addEventListener('click', () => {

    formAdicionarTarefa.classList.toggle('hidden');
    isFormActive = !formAdicionarTarefa.classList.contains('hidden');

    if (isFormActive) {

        btDelete.addEventListener('click', () => {
            textarea.value = '';
        }); 

        btCancel.addEventListener('click', () => {
            formAdicionarTarefa.classList.add('hidden');
   //         formAdicionarTarefa.setAttribute('aria-hidden', 'true');
            textarea.value = '';
        });
    } 

});

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
 //   debugger;
    const tarefa = {
        descricao: textarea.value
    }
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizaTarefa();
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', function() {
    tarefas.forEach(tar => {
        const elementoTarefa = criarElementoTarefa(tar);
        ulTarefas.append(elementoTarefa);
    });
    tarefaEmAndamento.textContent = '';
//   const lista = document.querySelector('.app__section-teste');
//   const antigoItem = document.createElement("li");
//   antigoItem.textContent = "Item antigo";
//   lista.appendChild(antigoItem);

//   const novoItem = document.createElement("li");
//   novoItem.textContent = "Item substituto";
//   lista.replaceChild(novoItem, antigoItem);

// let div = document.querySelector('.app__section-teste');
//lista.prepend("Item 0");  // Este item será inserido no começo da lista.

// div.insertAdjacentHTML('beforebegin', '<p>Antes da div</p>');
// div.insertAdjacentHTML('afterend', '<p>Depois da div</p>');
// div.insertAdjacentHTML('afterbegin', '<p>No começo da div</p>');
// div.insertAdjacentHTML('beforeend', '<p>No final da div</p>');
});

document.addEventListener('FocoFinalizado',() => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled',true);
        document.getElementById('start-pause').setAttribute('disabled','disabled');
        tarefaSelecionada.completa = true;
        liTarefaSelecionada.onclick = null;
        atualizaTarefa();
    }    
        // document.querySelectorAll('.app__section-task-list-item-active').forEach(element => {
        // element.classList.remove('app__section-task-list-item-active');
        // element.classList.add('app__section-task-list-item-complete');
        // element.querySelector('button').setAttribute('disabled', true);
        // document.getElementById('start-pause').setAttribute('disabled','disabled');
        // }); 
});

function removerTarefas(soCompletas) {

    tarefaEmAndamento.textContent = '';
    let seletor = '.app__section-task-list-item-complete';

    if (soCompletas) {
        tarefas = tarefas.filter(tarefa => !tarefa.completa);
        atualizaTarefa();
    } else {
        seletor = '.app__section-task-list-item';
        localStorage.removeItem('tarefas');
    }    
    document.querySelectorAll(seletor).forEach(tar => {
        tar.remove();
    });
}

limpaTarefasConcluidas.onclick = () => {
    tarefaEmAndamento.textContent = '';
    tarefas.forEach(tar => {
        if (tar.completa) {
            delete tar.completa;
        }
    });    
    atualizaTarefa();
    document.querySelectorAll('.app__section-task-list-item-complete').forEach(element => {
        element.classList.remove('app__section-task-list-item-complete');
        element.querySelector('button').removeAttribute('disabled');
    });
};

removeTarefasConcluidas.addEventListener('click', () => removerTarefas(true));

removeTodasTarefas.onclick = () => removerTarefas(false); 
   

