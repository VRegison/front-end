document.addEventListener("DOMContentLoaded", async () => {
   const coursesContainer = document.querySelector(".courses-row");
 
   try {
     // Substitua pela URL real da sua API
     var courses = await axios.get(`${urlApi}cursos/`);
      courses =  courses.data
     coursesContainer.innerHTML = ""; // Limpa o container antes de preencher os cursos
 
     courses.forEach(course => {
       const courseCard = document.createElement("div");
       courseCard.classList.add("course-card", "col-12", "col-sm-6", "col-md-4", "col-lg-3", "mb-4");
       
       courseCard.innerHTML = `
         <div class="card h-100">
           <div class="card-body d-flex flex-column align-items-center">
             <div class="icon mb-2">
               <img src="${course.imagem}" alt="${course.titulo}" style="width: 40px; height: 40px;">
             </div>
             <h5 class="card-title">${course.titulo}</h5>
             <p class="card-text">${course.descricao}</p>
             <div class="mt-auto">
               <span class="views">🌐 ${course.visualizacoes} Visualizações</span>
               <a href="${course.imagem}" class="btn btn-primary d-block mt-2">Saiba Mais</a>
             </div>
           </div>
         </div>
       `;
       
       coursesContainer.appendChild(courseCard);
     });
   } catch (error) {
     console.error("Erro ao buscar cursos:", error);
     coursesContainer.innerHTML = "<p>Erro ao carregar cursos. Tente novamente mais tarde.</p>";
   }
 });

 document.querySelector('.menu-toggle').addEventListener('click', () => {
   document.querySelector('.nav-links').classList.toggle('show');
});

async function carregarSelects() {
  try {
    const professoresResponse = await axios.get(`${urlApi}professores`);
    const categoriasResponse = await axios.get(`${urlApi}categorias`);
    
    preencherSelect("professor_id", professoresResponse.data);
    preencherSelect("categoria_id", categoriasResponse.data);
  } catch (error) {
    console.error("Erro ao carregar selects", error);
  }
}

function preencherSelect(selectId, data) {
  const select = document.getElementById(selectId);
  select.innerHTML = ""; // Limpa o select antes de adicionar opções
  data.forEach(item => {
    let option = new Option(item.nome, item.id);
    select.appendChild(option);
  });
}

async function cadastrarCurso(event) {
  event.preventDefault();

  const curso = {
    titulo: document.getElementById("titulo").value,
    descricao: document.getElementById("descricao").value,
    professor_id: document.getElementById("professor_id").value,
    categoria_id: document.getElementById("categoria_id").value,
    imagem: document.getElementById("imagem").value,
    visualizacoes: parseInt(document.getElementById("visualizacoes").value),
  };
  console.log("🚀 ~ cadastrarCurso ~ curso:", curso)

  try {
    await axios.post(`${urlApi}cursos`, curso);
    exibirMensagem("Curso cadastrado com sucesso!", "success");
    document.getElementById("cursoForm").reset();
  } catch (error) {
    exibirMensagem(`Erro: ${error.response?.data?.erro || "Erro desconhecido"}`, "danger");
  }
}

function exibirMensagem(mensagem, tipo) {
  document.getElementById("mensagem").innerHTML = `<div class="alert alert-${tipo}">${mensagem}</div>`;
}

document.getElementById("cursoForm").addEventListener("submit", cadastrarCurso);

carregarSelects();
