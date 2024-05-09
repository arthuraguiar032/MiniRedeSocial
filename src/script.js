// CRUD com  js BÁSICO
let miniRedeSocial = {
    usuarios: [
        {
            username: 'aguiarthur',
        }
    ],
    posts: [
        {
            id: Date.now(),
            owner: 'aguiarthur',
            content: 'Hello World! Hello'
        }
    ],
    //READ
    pegaPosts(){
        miniRedeSocial.posts.forEach(({id, content, owner})=> {
            this.criaPost({id, content, owner}, true);
        });
    },

    // Contagem de palavras com 4 ou mais letras e retorno das palavras extraídas
    contarPalavras() {
        let contar = {};
        this.posts.forEach(post => {
            const palavras = post.content.split(/\s+/); // dividindo o conteúdo em palavras
            palavras.forEach(palavras => {
                if (palavras.length >= 4) {
                    if (contar[palavras]) {
                        contar[palavras]++;
                    } else {
                        contar[palavras] = 1;
                    }
                }
            });
        });
        return contar;
    },

    //CREATE
    criaPost(dados, htmlOnly = false){
        const idInternoAqui = Date.now();

        //Cria post na memoria
        if(!htmlOnly){
            miniRedeSocial.posts.push({
                id: dados.id || idInternoAqui,
                owner: dados.owner,
                content: dados.content
            });
        }
        
        //Cria post no HTML
        const $listaTweets = document.querySelector('.listaTweets');
        if (dados.content.trim() !== '') {
            /**
             * 1. O post só é criado se o conteúdo não for vazio
             */
            $listaTweets.insertAdjacentHTML('afterbegin', `
                <li class="tweet" data-id=${idInternoAqui}>
                    <button class="btn-delete" alt='Deletar'>
                        <img src="../assets/trash.png"/>
                    </button>
                    <span contenteditable>
                        ${dados.content}
                    </span>
                </li>
            `);
        }
    },

    //DELETE
    apagaPost(index){
        let listaPostsAtualizada = miniRedeSocial.posts.filter((postAtual) => {
            return postAtual.id !== Number(index);
        });
        miniRedeSocial.posts = listaPostsAtualizada;
    },

    updateContentPost(index, newContent){
        let postQueVaiSerAtualizado = miniRedeSocial.posts.find((post) => 
            post.id === Number(index));
        
        postQueVaiSerAtualizado.content = newContent;
    },

}

// .replace(/[\u0300-\u036f]/g, '');

//READ
miniRedeSocial.pegaPosts();

//CREATE
const $meuForm = document.querySelector('form');
$meuForm.addEventListener('submit', function criaPostController(infosDoEvento){
    infosDoEvento.preventDefault();
    console.log('Formulário enviado');

    const $campoTweet = document.querySelector('textarea[name="campoTweet"]');
    
    miniRedeSocial.criaPost({
        owner: 'aguiarthur',
        content: $campoTweet.value
    });

    $campoTweet.value = '';

    //atualiza tendencias a cada novo tweet
    exibeTendencias();
});


//DELETE
let $listaTweets = document.querySelector('.listaTweets')
$listaTweets.addEventListener('click', function (infosDoEvento) {
    console.log('Houve um click!', infosDoEvento.target)
    const elementoClicado = infosDoEvento.target;
    const isBtnDeleteClick = infosDoEvento.target.classList.contains('btn-delete');

    if(isBtnDeleteClick){
        console.log('Botão de deletar clicado',elementoClicado.parentNode.getAttribute('data-id'));
        
        const idTweet = elementoClicado.parentNode.getAttribute('data-id');
        //remove na memoria
        miniRedeSocial.apagaPost(idTweet)
        //remove na tela
        elementoClicado.parentNode.remove();
    }
});

//UPDATE
document.querySelector('.listaTweets').addEventListener('input', function(infosDoEvento){
    const elementoAtual = infosDoEvento.target;
    const id = elementoAtual.parentNode.getAttribute('data-id');

    miniRedeSocial.updateContentPost(id, elementoAtual.innerText);
});


//TrendTopics
function exibeTendencias(){
    const $listaTendencias = document.querySelector('.listaTendencias');
    const palavras = miniRedeSocial.contarPalavras();
    console.log(palavras);

    //ordenar as palavras de acordo com a quantidade
    const palavrasOrdenadas = Object.entries(palavras).sort((a, b) => b[1] - a[1]);
    console.log(palavrasOrdenadas);
    
    let listaTrendHTML = '';

    if(palavrasOrdenadas.length !== 0){
        palavrasOrdenadas.forEach((palavra, quantidade) => {
            listaTrendHTML += `
                <li class="tendencia">
                    <span>${palavra[0]}</span>
                    <span>${palavra[1]}</span>
                </li>
                `
        });    
    }

    $listaTendencias.innerHTML = listaTrendHTML;
}
exibeTendencias();


//Funções para autoresize da textarea
function addAutoResize() {
    document.querySelectorAll('[data-autoresize]').forEach(function (element) {
      element.style.boxSizing = 'border-box';
      var offset = element.offsetHeight - element.clientHeight;
      element.addEventListener('input', function (event) {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + offset + 'px';
      });
      element.removeAttribute('data-autoresize');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    addAutoResize();
});

function carregarNovasTextareas() {
    // Suponha que você carregou novas textareas aqui, por exemplo:
    var novasTextareas = document.createElement('textarea');
    novasTextareas.className = 'autoresize';
    document.body.appendChild(novasTextareas);

    // Chame addAutoResize() novamente para aplicar redimensionamento automático a novas textareas
    addAutoResize();
}

//http://opensource.locaweb.com.br/locawebstyle/documentacao/formularios/textarea/

//https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Box_alignment_in_grid_layout

