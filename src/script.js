// CRUD com  js BÁSICO
let miniRedeSocial = {
    usuarios: [
        {
            username: 'aguiarthur',
            color: gerarCorAleatoria()
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
    
    //Read Usuarios
    pegaUsuarios() {
        return this.usuarios.map(usuario => usuario.username);
    },

    //Verifica se usuario existe
    existeUsuario(username) {
        return this.pegaUsuarios().includes(username);
    },
    
    //Adiciona Usuario
    criaUsuario(username) {
        if (!this.existeUsuario(username)) {
            this.usuarios.push({
                username,
                color: gerarCorAleatoria()
            });
            return true;
        }else{
            return false;
        }
    }

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
    const $campoUsuario = document.getElementById('selecaoUsuario');
    usuarioSelecionadoValor = $campoUsuario.value;
    if (usuarioSelecionadoValor === '0') {
        alert('Selecione um usuário');
        return;
    } 
    
    usuarioSeleciondoText = $campoUsuario.options[$campoUsuario.selectedIndex].text;
    
    miniRedeSocial.criaPost({
        owner: usuarioSeleciondoText,
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
        for(let i =0; i<palavrasOrdenadas.length && i<10; i++){
            listaTrendHTML += `
                <li class="tendencia">
                    <span>${i+1}. ${palavrasOrdenadas[i][0]}</span>
                </li>
                `
        }   
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

//Funcoes pra gerar cores para usuarios
function gerarCorAleatoria() {
    let cor;
    do {
      cor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      // Completar com zeros se necessário
      while (cor.length < 7) {
        cor += '0';
      }
    } while (isCorClara(cor)); // Garante que a cor não seja muito clara
    return cor;
}
  
function isCorClara(cor) {
    // Convertendo a cor hexadecimal para componentes RGB
    const r = parseInt(cor.slice(1, 3), 16);
    const g = parseInt(cor.slice(3, 5), 16);
    const b = parseInt(cor.slice(5, 7), 16);
    // Definindo um limite para considerar a cor "clara"
    const limite = 200;
    return r > limite && g > limite && b > limite;
}

//Cadastrar Usuario Controller
const $formUser = document.querySelector('.formUser');
$formUser.addEventListener('submit', function cadastraUsuarioController(infosDoEvento){
    infosDoEvento.preventDefault();
    const $campoUsuario = document.querySelector('input[name="campoUsuario"]');

    if(!miniRedeSocial.criaUsuario($campoUsuario.value)){
        alert('Usuário já existe');
        return;
    }

    $campoUsuario.value = '';
    alert('Usuário cadastrado com sucesso');
    preencherDropDownUsuarios();
});


//Função  pra preencher dropdown usuarios
function preencherDropDownUsuarios(){
    const $dropdown = document.getElementById('selecaoUsuario')
    $dropdown.innerHTML = `
        <option value="0">Selecione um usuário</option>
    `;
    $dropdown.selectedIndex = 0;
    
    const usuarios = miniRedeSocial.pegaUsuarios();

    usuarios.forEach(usuario => {
        const $option = document.createElement('option');
        $option.value = usuario;
        $option.innerText = usuario;
        $dropdown.appendChild($option);
    });
}
preencherDropDownUsuarios();

//http://opensource.locaweb.com.br/locawebstyle/documentacao/formularios/textarea/

//https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Box_alignment_in_grid_layout

