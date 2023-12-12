//Inicialização de algumas variáveis
const main = document.getElementById("main");
const servicos_disp = document.getElementById("servicos-disponiveis");
const nav = document.getElementById("nav");
const filtros = document.getElementById("filtro");
const login_usuario = document.getElementById("login-usuario");

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
        const servicos_lista = `<p>${data.nome}</p>
                                <p>${data.tipo}</p>
                                <p>${data.descricao}</p>
                                <p>${data.bairro}, ${data.cidade}/${data.estado}</p>
                                <p>Horário: ${data.horario}</p>
                                <p>Contato: ${data.contato}</p>`;
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

  const lista_servicos = document.createElement('div')
  nav.classList.add('nav')
  const content = `<h2>Filtros</h2>
                    <div class="servicos"> 
                      <ul id="lista-servicos">
                      </ul>
                    </div>`
  lista_servicos.innerHTML = content
  nav.appendChild(lista_servicos)

  const lista = document.getElementById("lista-servicos")

  if (pessoa.servicos.length != 0){
      pessoa.servicos.map((data) => {
      
      const lista_item = document.createElement('li');
      const button_item = document.createElement('button')

      button_item.innerText = `${data.nome}`
      button_item.id = `servico-${data.idServico}`
      button_item.addEventListener('click', (event) => {
        event.preventDefault()
        servico(data)
      })

      lista_item.appendChild(button_item)
      lista.appendChild(lista_item)
      
    })
  } else {
        const sem_servico = document.createElement('p');
        sem_servico.innerHTML=`Nenhum serviço cadastrado`
        lista.appendChild(sem_servico)
  }

  const item_adicionar = document.createElement('li');
  const button_adicionar = document.createElement('button')

  button_adicionar.innerText = 'Adicionar um serviço'
  button_adicionar.id = 'adicionar-servico'
  button_adicionar.addEventListener('click', (event) => {
    event.preventDefault()
    cadastro_servico(pessoa.id, pessoa.email)
  })

  item_adicionar.appendChild(button_adicionar)
  lista.appendChild(item_adicionar)

  const excluir = document.createElement('li');
  const button_excluir = document.createElement('button')

  button_excluir.innerText = 'Excluir usuário'
  button_excluir.id = 'excluir-usuario'
  button_excluir.addEventListener('click', (event) => {
    event.preventDefault()
    delete_pessoa(pessoa.id)
    deslogar()
  })

  excluir.appendChild(button_excluir)
  lista.appendChild(excluir)  

  remove_content(main)
}

/*
  --------------------------------------------------------------------------------------
  Função de renderização do formulário com as informações cadastradas e possibilidade de edição 
  --------------------------------------------------------------------------------------
*/
function servico(data){

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

  main.appendChild(servico_elemento)

  const formulario_servico = document.getElementById("formulario-servico");
  formulario_servico.addEventListener("submit", function(event){

    event.preventDefault()
    const formData = new FormData(formulario_servico);
    put_servico(formData, data.idServico)
      .then(response => alert('Serviço editado'))  
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
        .then(response => {
          alert(`Usuario ${formData.email} cadastrada`)
          get_pessoa(formData.email)
            .then(pessoa => pagina_logada(pessoa))
        })
    } else {
      alert('Senha e Confirmação da senha não são iguais!')
    }     
  })  
}
/*
  --------------------------------------------------------------------------------------
  Função de renderização do formulário de cadastro de serviço
  --------------------------------------------------------------------------------------
*/
function cadastro_servico(id, email){

  remove_content(main)
  main.classList.add("form")

  const servico_elemento = document.createElement('form')
  servico_elemento.id = 'cadastro-servico'
  const form = `<div>
                  <label for="nome">Nome do serviço</label>
                  <input type="text" name="nome" id="nome" placeholder="Insira o nome " />
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

  main.appendChild(servico_elemento)

  const formulario = document.getElementById("cadastro-servico");
  formulario.addEventListener("submit", function(event){

    event.preventDefault()
    const formData = new FormData(formulario);

    post_servico(formData, idPrestadora=id)
        .then(response => {
          alert(`Serviço ${response.servico.nome} cadastrado`)
          get_pessoa(email)
            .then(pessoa => pagina_logada(pessoa))
        })
  })
}