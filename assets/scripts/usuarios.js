
async function carregarUsuarios() {
   try {
       const response = await axios.get(`${urlApi}usuarios`);
       const usuarios = response.data;

       const tabela = document.getElementById("usuariosBody");
       tabela.innerHTML = ""; // Limpar a tabela antes de adicionar os dados

       usuarios.forEach(usuario => {
           const row = document.createElement("tr");
           row.innerHTML = `
               <td>${usuario.id}</td>
               <td>${usuario.nome}</td>
               <td>${usuario.email}</td>
               <td>
                   <button class="btn btn-warning btn-sm" onclick="editarUsuario(${usuario.id})"><i class="fas fa-edit"></i> Editar</button>
                   <button class="btn btn-danger btn-sm" onclick="deletarUsuario(${usuario.id})"><i class="fas fa-trash-alt"></i> Deletar</button>
               </td>
           `;
           tabela.appendChild(row);
       });

       // Inicializa o DataTable após carregar os dados
       $('#usuariosTable').DataTable();
   } catch (error) {
       console.error("Erro ao carregar usuários:", error);
   }
}

async function editarUsuario(id) {
try {
// Obter os dados do usuário atual para preencher os valores existentes
const response = await axios.get(`${urlApi}usuarios/${id}`);
const usuario = response.data;

// Prompt para o usuário editar os valores, já preenchendo com os dados antigos
const nome = prompt("Digite o novo nome do usuário:", usuario.nome);
const email = prompt("Digite o novo email do usuário:", usuario.email);
const senha = prompt("Digite a nova senha do usuário:", usuario.senha);

// Verifica se os campos não estão vazios antes de enviar a atualização
if (nome && email && senha) {
   // Atualiza o usuário
   await axios.put(`${urlApi}usuarios/${id}`, {
       nome: nome,
       email: email,
       senha: senha
   });
   alert("Usuário atualizado com sucesso!");
   carregarUsuarios();
} else {
   alert("Por favor, preencha todos os campos.");
}
} catch (error) {
alert("Erro ao atualizar usuário.");
}
}

async function deletarUsuario(id) {
// Confirmação antes de deletar o usuário
if (confirm("Tem certeza que deseja excluir este usuário?")) {
try {
   // Realiza a exclusão do usuário
   await axios.delete(`${urlApi}usuarios/${id}`);
   alert("Usuário excluído com sucesso!");
   carregarUsuarios();
} catch (error) {
   alert("Erro ao excluir usuário.");
}
}
}
;

// Carregar os dados ao carregar a página
carregarUsuarios();

document.getElementById("usuarioForm").addEventListener("submit", async function (event) {
   event.preventDefault();
   const nome = document.getElementById("nome").value;
   const email = document.getElementById("email").value;
   const senha = document.getElementById("senha").value;

   try {
       const response = await axios.post(`${urlApi}/usuarios`, {
           nome: nome,
           email: email,
           senha: senha
       });
       document.getElementById("mensagem").innerHTML = '<div class="alert alert-success">Usuário cadastrado com sucesso!</div>';
       this.reset(); // Limpar os campos após o cadastro
       window.location.href = 'login.html'
   } catch (error) {
       document.getElementById("mensagem").innerHTML = '<div class="alert alert-danger">Erro ao cadastrar usuário.</div>';
   }
})