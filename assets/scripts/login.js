async function login() {
   const email       = document.getElementById('email').value;
   const senha       = document.getElementById('senha').value;
   const feedback    = document.getElementById('feedback');
   const loginButton = document.getElementById('loginButton');
 
   if (!email || !senha) {
     feedback.textContent = 'Preencha todos os campos!';
     feedback.style.color = 'red';
     return;
   }
 
   loginButton.disabled = true;
   loginButton.textContent = 'Entrando...';
   loginButton.classList.add('button-loading');
 
   try {
     const response = await axios.post(`${urlApi}auth/login`, { email, senha });
 
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
 