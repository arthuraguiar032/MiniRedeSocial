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
    ]
}

//CREATE
function criaPost(dados){
    miniRedeSocial.posts.push({
        id: miniRedeSocial.posts.length + 1,
        owner: dados.owner,
        content: dados.content
    });
}


//READ
function pegaPosts(){
    return miniRedeSocial.posts;
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

criaPost({owner: 'aguiarthur', content: 'Segundo tweet!'});
console.log(pegaPosts());
updateContentPost(2, 'Segundo tweet atualizado!');