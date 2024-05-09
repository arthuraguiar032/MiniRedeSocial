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
            content: 'Hello World!'
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

function exibirTendencias() {
    const tendencias = miniRedeSocial.contarPalavras();
    const $assuntosMaisComentados = document.getElementById('assuntosMaisComentados').getElementsByTagName('tbody')[0];

    // Limpa a lista de tendências antes de adicionar as novas
    $assuntosMaisComentados.innerHTML = '';

    // Ordena as palavras por número de ocorrências
    const tendenciasOrdenadas = Object.entries(tendencias).sort((a, b) => b[1] - a[1]);

    // Adiciona este console.log para verificar as tendências
    console.log(tendenciasOrdenadas);

    // Limita o número de tendências a serem exibidas (por exemplo, as 10 principais)
    const limiteTendencias = 10;
    for (let i = 0; i < Math.min(limiteTendencias, tendenciasOrdenadas.length); i++) {
        const [palavra, ocorrencias] = tendenciasOrdenadas[i];
        const linhaTabela = `<tr><td class="tendencia">${palavra} (${ocorrencias} vezes)</td></tr>`;
        $assuntosMaisComentados.insertAdjacentHTML('beforeend', linhaTabela);
    }
}

// document.getElementById('assuntosMaisComentados').addEventListener('click', function(event) {
//     if (event.target.classList.contains('tendencia')) {
//         const palavra = event.target.textContent.split(' ')[0]; // Extrai a palavra da tendência clicada
//         const $listaTweets = document.querySelector('.listaTweets');

//         // Filtra os posts que contêm a palavra clicada
//         const postsFiltrados = miniRedeSocial.posts.filter(post => {
//             return post.content.toLowerCase().includes(palavra);
//         });

//         // Limpa a lista de tweets antes de adicionar os relacionados à tendência clicada
//         $listaTweets.innerHTML = '';

//         // Adiciona os posts relacionados à tendência clicada na lista de tweets
//         postsFiltrados.forEach(post => {
//             miniRedeSocial.criaPost(post, true);
//         });
//     }
// });

// document.getElementById('assuntosMaisComentados').addEventListener('click', function(event) {
//     if (event.target.classList.contains('tendencia')) {
//         const palavra = event.target.textContent.split(' ')[0]; // Extrai a palavra da tendência clicada
//         const $listaTweets = document.querySelector('.listaTweets');

//         // Filtra os posts que contêm a palavra clicada
//         const postsFiltrados = miniRedeSocial.posts.filter(post => {
//             return post.content.toLowerCase().includes(palavra);
//         });

//         // Limpa a lista de tweets antes de adicionar os relacionados à tendência clicada
//         $listaTweets.innerHTML = '';
        
//         // Adiciona os posts relacionados à tendência clicada na lista de tweets
//         postsFiltrados.forEach(post => {
//             miniRedeSocial.criaPost(post, true);
//         });
//     }
// });

exibirTendencias();

//http://opensource.locaweb.com.br/locawebstyle/documentacao/formularios/textarea/

//https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Box_alignment_in_grid_layout

