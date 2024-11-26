var urlApi = "https://back-end-70gl.onrender.com/"

// http://localhost:3000/usuarios/login
$(document).ready(async function () {
  $('#userTable').DataTable({
    dom: 'lrtip',

    language: {
      "sEmptyTable": "Nenhum registro encontrado dentro de 60 dias",
      "sInfo": "",
      "sInfoEmpty": "",
      "sInfoFiltered": "(Filtrados de _MAX_ registros)",
      "sInfoPostFix": "",
      "sInfoThousands": ".",
      "sLengthMenu": "",
      "sLoadingRecords": "Carregando...",
      "sProcessing": "Processando...",
      "sZeroRecords": "Nenhum registro encontrado",
      "sSearch": "",
      "oPaginate": {
          "sNext": "Próximo",
          "sPrevious": "Anterior",
          "sFirst": "Primeiro",
          "sLast": "Último"
      },
      "oAria": {
          "sSortAscending": ": Ordenar colunas de forma ascendente",
          "sSortDescending": ": Ordenar colunas de forma descendente"
      }

  }
  });
await listarUsuarios();

});

async function cadastrarUsuarioPage() {
  const nome = $('#nome').val();
  const email = $('#email').val();
  const senha = $('#senha').val();
  const funcao = $('#funcao').val();

  const userData = {
    nome: nome,
    email: email,
    funcao: funcao,
    cursos: [], 
    senha: senha
  };

  try {
    const response = await $.ajax({
      url: `${urlApi}usuarios/salva`, 
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(userData)
    });

    Swal.fire({
      icon: 'success',
      title: 'Cadastro realizado com sucesso!',
      text: 'Você será redirecionado para o login.',
      showConfirmButton: false,
      timer: 3000
    }).then(() => {
      window.location.href = 'login.html';  
    });

  } catch (error) {
    
    Swal.fire({
      icon: 'error',
      title: 'Erro ao cadastrar!',
      text: 'Por favor, tente novamente.',
      showConfirmButton: true
    });
  }
}
async function listarUsuarios() {
  var response = await axios.get(`${urlApi}usuarios/lista`);
  response = response.data;
  console.log("🚀 ~ response:", response);

  const tableBody = $('#linhas'); // Obtendo o corpo da tabela

  // Limpar o corpo da tabela antes de adicionar as novas linhas
  tableBody.empty();

    response.forEach(function(usuario) {
      const row = $('<tr></tr>');

      // Adicionando as células de dados
      row.append('<td id="id_usuario">' + usuario._id + '</td>'); 
      row.append('<td>' + usuario.nome + '</td>'); 
      row.append('<td>' + usuario.email + '</td>'); 
      row.append('<td>' + usuario.cursos + '</td>');
      row.append('<td>' + usuario.funcao + '</td>');
      row.append('<td><button class="btn btn-primary" onclick="editarUsuario(\'' + usuario._id + '\',\'' + usuario.nome + '\',\'' + usuario.email + '\')">Editar</button></td>');
      row.append('<td><button class="btn btn-danger" onclick="excluirUsuario(\'' + usuario._id + '\')">Excluir</button></td>');


      tableBody.append(row);
    });
}
async function cadastrarUsuario() {
  const { value: formValues } = await Swal.fire({
    title: 'Cadastrar Novo Usuário',
    html:
      '<input id="nome" class="swal2-input" placeholder="Nome">' +
      '<input id="email" class="swal2-input" placeholder="Email" type="email">' +
      '<input id="senha" class="swal2-input" placeholder="Senha" type="password">' +
      '<select id="funcao" class="swal2-input">' +
        '<option value="Aluno">Aluno</option>' +
        '<option value="Admin">Admin</option>' +
      '</select>',
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      return {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value,
        funcao: document.getElementById('funcao').value,  
      };
    }
  });

  if (formValues) {
    try {
      const response = await axios.post(`${urlApi}usuarios/salva`, {
        nome: formValues.nome,
        email: formValues.email,
        funcao: formValues.funcao,  
        cursos: [], 
        senha: formValues.senha
      });
      console.log("🚀 ~ cadastrarUsuario ~ response:", response);

   
      Swal.fire({
        title: 'Usuário Cadastrado!',
        text: 'O usuário foi cadastrado com sucesso.',
        icon: 'success',
        confirmButtonText: 'Fechar'
      });

      location.reload();

    } catch (error) {
      
      Swal.fire({
        title: 'Erro!',
        text: 'Ocorreu um erro ao cadastrar o usuário.',
        icon: 'error',
        confirmButtonText: 'Fechar'
      });
      console.error('Erro ao cadastrar usuário:', error);
    }
  }
}

async function editarUsuario(usuarioId,nomeAtual, emailAtual) {



  const { value: formValues } = await Swal.fire({
    title: 'Editar Usuário',
    html:
      '<input id="nome" class="swal2-input" placeholder="Nome" value="' + nomeAtual + '">' +
      '<input id="email" class="swal2-input" placeholder="Email" type="email" value="' + emailAtual + '">',
    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      return {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
      };
    }
  });

  if (formValues) {
    try {
      const response = await axios.put(`${urlApi}usuarios/edita/${usuarioId}`, {
        nome: formValues.nome,
        email: formValues.email,
      });
      console.log("🚀 ~ editarUsuario ~ response:", response);

      Swal.fire({
        title: 'Usuário Editado!',
        text: 'As informações do usuário foram atualizadas com sucesso.',
        icon: 'success',
        confirmButtonText: 'Fechar'
      });
      location.reload();

    } catch (error) {
      Swal.fire({
        title: 'Erro!',
        text: 'Ocorreu um erro ao editar o usuário.',
        icon: 'error',
        confirmButtonText: 'Fechar'
      });
      console.error('Erro ao editar usuário:', error);
    }
  }
}

async function excluirUsuario(usuarioId) {
  const confirmacao = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Você não poderá reverter essa ação!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar'
  });

  if (confirmacao.isConfirmed) {
    try {
      const response = await axios.delete(`${urlApi}usuarios/apaga/${usuarioId}`);
      console.log("🚀 ~ excluirUsuario ~ response:", response);

      Swal.fire({
        title: 'Excluído!',
        text: 'O usuário foi excluído com sucesso.',
        icon: 'success',
        confirmButtonText: 'Fechar'
      });
      location.reload();

    } catch (error) {
      Swal.fire({
        title: 'Erro!',
        text: 'Ocorreu um erro ao excluir o usuário.',
        icon: 'error',
        confirmButtonText: 'Fechar'
      });
      console.error('Erro ao excluir usuário:', error);
    }
  }
}

async function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const feedback = document.getElementById('feedback');
    const loginButton = document.getElementById('loginButton');
  
    // Validação básica
    if (!email || !senha) {
      feedback.textContent = 'Preencha todos os campos!';
      feedback.style.color = 'red';
      return;
    }
  
    // Exibe o loader no botão
    loginButton.disabled = true;
    loginButton.textContent = 'Entrando...';
    loginButton.classList.add('button-loading');
  
    try {
      // Simula uma requisição à API
      const response = await axios.post(`${urlApi}usuarios/login`, { email, senha });
  
      // Verifica se a requisição foi bem-sucedida
      if (response.status === 200) {
        feedback.textContent = 'Login realizado com sucesso!';
        feedback.style.color = 'green';
      
          setTimeout(() => {
            window.location.href = '../pages/dashboard.html';
          }, 2000);
       
  
      }
    } catch (error) {
      // Mostra mensagem de erro
      feedback.textContent = 'Erro ao fazer login. Verifique suas credenciais!';
      feedback.style.color = 'red';
    } finally {
      // Restaura o botão
      loginButton.disabled = false;
      loginButton.textContent = 'Entrar';
      loginButton.classList.remove('button-loading');
    }
  }
  