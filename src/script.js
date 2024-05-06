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


// CRUD com  js BÁSICO
let miniRedeSocial = {
    usuarios: [
        {
            username: 'aguiarthur',
        }
    ],
    posts: [
        {
            id: 1,
            owner: 'aguiarthur',
            content: 'Hello World!'
        }
    ],
    //READ
    pegaPosts(){
        miniRedeSocial.posts.forEach(({content, owner})=> {
            this.criaPost({content, owner}, true);
        });
    },

    //CREATE
    criaPost(dados, htmlOnly = false){
        //Cria post na memoria
        if(!htmlOnly){
            miniRedeSocial.posts.push({
                id: miniRedeSocial.posts.length + 1,
                owner: dados.owner,
                content: dados.content
            });
        }
        
        //Cria post no HTML
        const $listaTweets = document.querySelector('.listaTweets');
        $listaTweets.insertAdjacentHTML('afterbegin', `<li class="tweet">${dados.content}</li>`);
    }
}

//UPDATE
function updateContentPost(index, newContent){
    let postQueVaiSerAtualizado = pegaPosts().find((post) => 
        post.id === index);
    
    postQueVaiSerAtualizado.content = newContent;
}

//DELETE
function deletaPost(index){
    let listaPostsAtualizada = pegaPosts().filter((postAtual) => {
        return postAtual.id !== index;
    });
    miniRedeSocial.posts = listaPostsAtualizada;
}

miniRedeSocial.pegaPosts();



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

