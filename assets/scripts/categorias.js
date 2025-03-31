$(document).ready(function () {
  $("#categoriasTable").DataTable();
  carregarCategorias();
});

// Função para carregar categorias e atualizar o DataTable
async function carregarCategorias() {
  try {
    const response = await axios.get(`${urlApi}categorias`);
    const categorias = response.data;
    console.log("🚀 ~ carregarCategorias ~ urlApi:", urlApi);
    const table = $("#categoriasTable").DataTable();

    // Limpa a tabela antes de adicionar novos dados
    table.clear();

    // Adiciona as categorias à tabela
    categorias.forEach((categoria) => {
      table.row
        .add([
          categoria.id,
          categoria.nome,
          categoria.descricao,
          `<button class="btn btn-warning btn-sm" onclick="editarCategoria(${categoria.id}, '${categoria.nome}', '${categoria.descricao}')">Editar</button>
                  <button class="btn btn-danger btn-sm" onclick="deletarCategoria(${categoria.id})">Excluir</button>`,
        ])
        .draw(false);
    });
  } catch (error) {
    console.error("Erro ao carregar categorias", error);
  }
}

// Função para editar uma categoria
async function editarCategoria(id, nome, descricao) {
  const novoNome = prompt("Digite o novo nome da categoria:", nome);
  const novaDescricao = prompt(
    "Digite a nova descrição da categoria:",
    descricao
  );

  if (novoNome && novaDescricao) {
    try {
      await axios.put(`${urlApi}categorias/${id}`, {
        nome: novoNome,
        descricao: novaDescricao,
      });
      alert("Categoria atualizada com sucesso!");
      carregarCategorias();
    } catch (error) {
      alert("Erro ao atualizar categoria.");
    }
  }
}

// Função para deletar uma categoria
async function deletarCategoria(id) {
  if (confirm("Tem certeza que deseja excluir esta categoria?")) {
    try {
      await axios.delete(`${urlApi}categorias/${id}`);
      alert("Categoria excluída com sucesso!");
      carregarCategorias();
    } catch (error) {
      alert("Erro ao excluir categoria.");
    }
  }
}

document
  .getElementById("categoriaForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita o recarregamento da página

    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;

    try {
      await axios.post(`${urlApi}categorias`, { nome, descricao });
      document.getElementById("mensagem").innerHTML =
        '<div class="alert alert-success">Categoria cadastrada com sucesso!</div>';
      document.getElementById("categoriaForm").reset();
    } catch (error) {
      document.getElementById("mensagem").innerHTML =
        '<div class="alert alert-danger">Erro ao cadastrar categoria.</div>';
    }
  });
