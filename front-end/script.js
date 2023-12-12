//Inicialização de algumas variáveis
const main = document.getElementById("main");
const servicos_disp = document.getElementById("servicos-disponiveis");
const nav = document.getElementById("nav");
const filtros = document.getElementById("filtro");
const login_usuario = document.getElementById("login-usuario");

//Função para "remover" mudando o display para none dos filhos de um container
const remove_content = (container) => {
  container.childNodes.forEach(child => {
    child.style? child.style.display = "none" : "Child undefined"
    } 
  )
}

const deslogar = () => location.reload()

let servicos_lista = "";
/*
  --------------------------------------------------------------------------------------
  Ao carregar a página inicial é realizada a requisição dos serviços existentes
  --------------------------------------------------------------------------------------
*/
get_servico()
  .then(servicos => {
    if (servicos.Servicos.length != 0){

      //Caso haja algum serviço no servidor é adicionado para cada um deles um elemento na lista com as informações disponíveis

      servicos.Servicos.map((data) => {
        const servicos_lista = `<p>Serviço: ${data.nome}</p>
                                <p>Tipo: ${data.tipo.toLowerCase()}</p>
                                <p>Descrição: ${data.descricao  || 'Não Informada'}</p>
                                <p>Localidades: ${data.bairro || 'Bairro não Informado'}, ${data.cidade || 'Cidade não Informada'}/${data.estado || 'Estado não Informado'}</p>
                                <p>Horário: ${data.horario || 'Não Informado'}</p>`;
        const lista = document.createElement('li');
        lista.innerHTML = servicos_lista
        servicos_disp.appendChild(lista);

      });
    } else {
      //Caso não haja a mensagem é inserida na página

      const sem_servico = document.createElement('p');
      sem_servico.innerHTML='Serviços não encontrado'
      servicos_disp.appendChild(sem_servico)
    }
})

/*
  --------------------------------------------------------------------------------------
  Função para a tentativa de login
  --------------------------------------------------------------------------------------
*/
function login(e) {

  e.preventDefault()
  const usuario = document.getElementById("email-login").value;
  const senha = document.getElementById("senha-login").value;

  get_pessoa(usuario)
    .then((pessoa)=> {
      if (usuario == pessoa.email && senha == pessoa.senha){ 
        pagina_logada(pessoa)
        document.getElementById('login').style.display='none'
      } else {
        alert('email ou senha errada! Tente novamente ou se cadastre no site')
      }
    })
}
/*
  -----------------------------
  Carrega a página logada
  ------------------------------
*/
function pagina_logada(pessoa){

  filtros.style.display = 'none'
  const nav = document.getElementById('nav')

  remove_content(nav)
  nav.style.display = 'block'

  const lista_servicos = document.createElement('div')
  lista_servicos.id = "lista-container"

  
  nav.classList.add('nav')
  const content = `<h2>Serviços</h2>
                    <div class="servicos"> 
                      <ul id="lista-servicos">
                      </ul>
                      <ul id="lista-pessoa">
                      </ul>
                    </div>`
  lista_servicos.innerHTML = content
  nav.appendChild(lista_servicos)
  lista_servicos.style.display = 'block'


  const lista_servico = document.getElementById("lista-servicos")
  const lista_pessoa = document.getElementById("lista-pessoa")
  
  if (pessoa.servicos.length != 0){
      pessoa.servicos.map((data) => {

      const lista_item = document.createElement('li');
      const button_item = document.createElement('button')

      button_item.innerText = `${data.nome}`
      button_item.id = `servico-${data.idServico}`
      button_item.addEventListener('click', (event) => {
        servico_form(data)
      })

      lista_item.appendChild(button_item)
      lista_servico.appendChild(lista_item)
      
    })
  } else {
        const sem_servico = document.createElement('p');
        sem_servico.id="nenhum-servico"
        sem_servico.innerHTML=`Nenhum serviço cadastrado`
        lista_servico.appendChild(sem_servico)
  }

  const item_adicionar = document.createElement('li');
  const button_adicionar = document.createElement('button')

  button_adicionar.innerText = 'Adicionar um serviço'
  button_adicionar.id = 'adicionar-servico'
  button_adicionar.addEventListener('click', (event) => {
    cadastro_servico(pessoa.id, pessoa.email)
  })

  item_adicionar.appendChild(button_adicionar)
  lista_pessoa.appendChild(item_adicionar)

  const excluir = document.createElement('li');
  const button_excluir = document.createElement('button')

  button_excluir.innerText = 'Excluir usuário'
  button_excluir.id = 'excluir-usuario'
  button_excluir.addEventListener('click', (event) => {
    delete_pessoa(pessoa.id)
    .then((response)=>{
      deslogar()
    })
  })

  excluir.appendChild(button_excluir)
  lista_pessoa.appendChild(excluir)  

  remove_content(main)
}

/*
  --------------------------------------------------------------------------------------
  Função de renderização do formulário com as informações cadastradas e possibilidade de edição 
  --------------------------------------------------------------------------------------
*/
function servico_form(data){

  remove_content(main)
  const formulario = document.getElementById('formulario-servico')
  let servico_elemento;

  if (!formulario){
    main.classList.add("form")

    servico_elemento = document.createElement('form')
    servico_elemento.id = 'formulario-servico'
  } else {
    servico_elemento = formulario
  }
  const form = `<div>
                  <label for="nome">Nome do serviço</label>
                  <input type="text" name="nome" id="nome" value="${data.nome}" required />
                </div>
                <div>
                  <label for="tipo">Tipo</label>
                  <select type="tipo" name="tipo" id="tipo" value="${data.tipo}" required>
                    <option>ELETRICISTA</option>
                    <option>HIDRAULICA</option>
                  </select>
                </div>
                <div>
                  <label for="estado">Estado</label>
                  <input type="text" name="estado" id="estado" value="${data.estado}" />
                </div>
                <div>
                  <label for="cidade">Cidade</label>
                  <input type="text" name="cidade" id="cidade" value="${data.cidade}" />
                </div>
                <div>
                  <label for="bairro">Bairro</label>
                  <input type="text" name="bairro" id="bairro" value="${data.bairro}" />
                </div>
                <div>
                  <label for="descricao">Descrição</label>
                  <textarea type="text" name="descricao" id="descricao" value="${data.descricao}"></textarea>
                </div>
                <div>
                  <label for="horario">Horário</label>
                  <input type="text" name="horario" id="horario" value="${data.horario}" />
                </div>
                <button type="submit" id="editar-servico">Editar</button>`
  servico_elemento.innerHTML = form
  servico_elemento.style.display = 'block'

  main.appendChild(servico_elemento)

  const formulario_servico = document.getElementById("formulario-servico");
  formulario_servico.addEventListener("submit", function(event){
    event.preventDefault()
    const formData = new FormData(formulario_servico);
    put_servico(formData, data.idServico)
      .then(response => alert(`Serviço ${response} editado`))  
  })
}
/*
  --------------------------------------------------------------------------------------
  Função de renderização do formulário de cadastro de usuário
  --------------------------------------------------------------------------------------
*/
function cadastro_usuario(){

  document.getElementById('login').style.display='none'
  nav.style.display="none"

  remove_content(main)
  main.classList.add("form")

  const elemento_pessoa = document.createElement('form')
  elemento_pessoa.id = 'cadastro-pessoa'
  const form = `<div>
                  <label for="nome">Nome</label>
                  <input type="text" name="nome" id="nome" placeholder="Insira seu nome" required/>
                </div>
                <div>
                  <label for="email">Email</label>
                  <input type="email" name="email" id="email" placeholder="email@gmail.com" required/>
                </div>
                <div>
                  <label for="senha">Senha</label>
                  <input type="password" name="senha" id="senha" placeholder="Insira a senha" required />
                </div>
                <div>
                  <label for="confirmacao">Confirmação da senha</label>
                  <input type="password" name="confirmacao" id="confirmacao" placeholder="Confirme sua senha" required />
                </div>
                <div>
                  <label for="sobre">Sobre</label>
                  <textarea type="text" name="sobre" id="sobre" aria-multiline="true" placeholder="Insira um breve resumo sobre você" rows="4" cols="50"></textarea>
                </div>
                <button type="submit" id="cadastrar-pessoa">Cadastrar</button>`
  elemento_pessoa.innerHTML = form

  main.appendChild(elemento_pessoa)

  const formulario = document.getElementById("cadastro-pessoa");
  formulario.addEventListener("submit", function(event){

    event.preventDefault()
    const formData = new FormData(formulario);
    const senha = formData.get("senha")
    const confirmacao_senha = formData.get("confirmacao")

    if (senha === confirmacao_senha){

      post_pessoa(formData)
      get_pessoa(formData.get("email"))
        .then(pessoa => {
          pagina_logada(pessoa) //Após cadastrar a pessoa redireciona para a pagina logada
        })
    } else {
      alert('Senha e Confirmação da senha não são iguais!')
    }     
  })  
}
/*
  --------------------------------------------------------------------------------------
  Função de adição de item na lista ao cadastrar novo serviço
  --------------------------------------------------------------------------------------
*/
function add_servico(servico){

  

  const lista_servico = document.getElementById("lista-servicos")

  const sem_servico = document.getElementById("nenhum-servico")

  if (sem_servico){lista_servico.removeChild(sem_servico)}
  
  const lista_item = document.createElement('li');
  const button_item = document.createElement('button')
  
  button_item.innerText = `${servico.nome}`
  button_item.id = `servico-${servico.idServico}`
  button_item.addEventListener('click', (event) => {
    servico_form(servico)
  })

  lista_item.appendChild(button_item)
  lista_servico.appendChild(lista_item)
}
/*
  --------------------------------------------------------------------------------------
  Função de renderização do formulário de cadastro de serviço
  --------------------------------------------------------------------------------------
*/
function cadastro_servico(id, email){

  remove_content(main)

  const formulario_existente = document.getElementById('cadastro-servico')
  let servico_elemento;

  if (!formulario_existente){
    main.classList.add("form")

    servico_elemento = document.createElement('form')
    servico_elemento.id = 'cadastro-servico'
  } else {
    servico_elemento = formulario_existente
  }
  const form = `<div>
                  <label for="nome">Nome do serviço</label>
                  <input type="text" name="nome" id="nome" placeholder="Insira o nome " required />
                </div>
                <div>
                  <label for="tipo">Tipo</label>
                  <select type="tipo" name="tipo" id="tipo">
                    <option>ELETRICISTA</option>
                    <option>HIDRAULICA</option>
                  </select>
                </div>
                <div>
                  <label for="estado">Estado</label>
                  <input type="text" name="estado" id="estado" placeholder="Estado" />
                </div>
                <div>
                  <label for="cidade">Cidade</label>
                  <input type="text" name="cidade" id="cidade" placeholder="Cidade" />
                </div>
                <div>
                  <label for="bairro">Bairro</label>
                  <input type="text" name="bairro" id="bairro" placeholder="Bairro" />
                </div>
                <div>
                  <label for="descricao">Descrição</label>
                  <textarea type="text" name="descricao" id="descricao" placeholder="Insira uma descrição do serviço"></textarea>
                </div>
                <div>
                  <label for="horario">Horário</label>
                  <input type="text" name="horario" id="horario" placeholder="12h/20h" />
                </div>
                <button type="submit" id="cadastrar-servico">Cadastrar</button>`

  servico_elemento.innerHTML = form
  servico_elemento.style.display = 'block'
  main.appendChild(servico_elemento)

  const formulario = document.getElementById("cadastro-servico");
  formulario.addEventListener("submit", function(event){

    event.preventDefault()
    const formData = new FormData(formulario);

 
    post_servico(formData, idPrestadora=id)
      .then(response => {
        alert(`Serviço ${response.nome} cadastrado`)
        add_servico(response)
      })       
  }, once=true)
}