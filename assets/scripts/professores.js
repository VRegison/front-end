
$(document).ready(function() {
    $('#tabelaProfessores').DataTable();
    carregarProfessores();
});
async function carregarProfessores() {
    try {
        const response = await axios.get(`${urlApi}professores`);
        const tabela = $('#tabelaProfessores').DataTable();
        console.log("🚀 ~ carregarProfessores ~ response:", response)
        
        tabela.clear();
        response.data.forEach(prof => {
            tabela.row.add([
                prof.id,
                prof.nome,
                prof.especialidade,
                `<button class='btn btn-warning btn-sm' onclick='editarProfessor(${prof.id})'>Editar</button>
                 <button class='btn btn-danger btn-sm' onclick='deletarProfessor(${prof.id})'>Excluir</button>`
            ]).draw(false);
        });
    } catch (error) {
        console.error("Erro ao carregar professores", error);
    }
}

async function editarProfessor(id) {
 try {
    const resposta = await axios.get(`${urlApi}professores/${id}`);
    const professor = resposta.data;

    const novoNome = prompt("Digite o novo nome do professor:", professor.nome);
    const novaEspecialidade = prompt("Digite a nova especialidade do professor:", professor.especialidade);

    if (novoNome !== null || novaEspecialidade !== null) {
          await axios.put(`${urlApi}professores/${id}`, {
             nome: novoNome || professor.nome, 
             especialidade: novaEspecialidade || professor.especialidade
          });
          alert("Professor atualizado com sucesso!");
          carregarProfessores();
    }
 } catch (error) {
    alert("Erro ao atualizar professor");
 }
}

async function deletarProfessor(id) {
    if (confirm("Tem certeza que deseja excluir este professor?")) {
        try {
            await axios.delete(`${urlApi}professores/${id}`);
            alert("Professor excluído com sucesso!");
            carregarProfessores();
        } catch (error) {
            alert("Erro ao excluir professor");
        }
    }
}
async function criarProfessor() {
   const nome = prompt("Digite o nome do professor:");
   if (!nome) return alert("Nome é obrigatório!");

   const especialidade = prompt("Digite a especialidade do professor:");
   if (!especialidade) return alert("Especialidade é obrigatória!");

   try {
       await axios.post(`${urlApi}professores`, { nome, especialidade });
       alert("Professor cadastrado com sucesso!");
       carregarProfessores(); // Atualiza a tabela
   } catch (error) {
       alert("Erro ao cadastrar professor");
   }
}




