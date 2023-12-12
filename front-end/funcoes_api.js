//Requisições da API

/*
  --------------------------------------------------------------------------------------
  Função para obter as informações da pessoa existente no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const get_pessoa = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/pessoa?email=${email}`, {
        method: "GET",
      });
      return await response.json();
    } catch (error) {
      return alert(`Ocorreu o ${error} ao fazer a requisição dos dados da pessoa`)
    }  
  };
  /*
    --------------------------------------------------------------------------------------
    Função para obter as informações dos servicos existente no servidor via requisição GET
    --------------------------------------------------------------------------------------
  */
  const get_servico = async () => {
    try {
    const response = await fetch("http://localhost:5000/servicos", {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    return alert(`Ocorreu o ${error} ao fazer a requisição dos dados de serviços`)
  }  
  };
  /*
    --------------------------------------------------------------------------------------
    Função para inserir uma pessoa na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const post_pessoa = async (formData) => {
    
    try {
    const response = await fetch("http://localhost:5000/pessoa", {
      method: "post",
      body: formData,
    })
      return await response.json();
    } catch (error){
      return alert(`Ocorreu o ${error} ao fazer o post dos dados da pessoa`)
    }
  
    
  };
  /*
    --------------------------------------------------------------------------------------
    Função para inserir um serviço na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const post_servico = async (formData, idPrestadora) => {

    formData.append('idPrestadora', idPrestadora);

    const response = await fetch("http://localhost:5000/servico", {
      method: "POST",
      body: formData,
    });
  
    return await response.json();
  };
  /*
    --------------------------------------------------------------------------------------
    Função para deletar uma pessoa do servidor via requisição DELETE
    --------------------------------------------------------------------------------------
  */
  const delete_pessoa = async (idPessoa) => {
    const response = await fetch(`http://localhost:5000/pessoa?idPessoa=${idPessoa}`, {
      method: "DELETE",
    });
  
    return await response.json();
  };
  /*
    --------------------------------------------------------------------------------------
    Função para editar um serviço do servidor via requisição PUT
    --------------------------------------------------------------------------------------
  */
  const put_servico = async (formData, idServico)  => {

    const response = await fetch(`http://localhost:5000/servico/${idServico}`, {
      method: "PUT",
      body: formData,
    });
  
    return await response.json();
  };
