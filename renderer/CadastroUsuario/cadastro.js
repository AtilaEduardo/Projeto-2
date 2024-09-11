const { ipcRenderer } = require('electron');

// Enviar dados do cadastro para o backend
document.getElementById('cadastro-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const nome            = document.getElementById('nome').value;
  const usuario         = document.getElementById('usuario').value;
  const senha           = document.getElementById('senha').value;
  const email           = document.getElementById('email').value;
  const data_nascimento = document.getElementById('data_nascimento').value;
  let   cpf             = document.getElementById('cpf').value;  // CPF com máscara
  const razao_social    = document.getElementById('razao_social').value;
  let   cnpj            = document.getElementById('cnpj').value;  // CPF com máscara
  const endereco        = document.getElementById('endereco').value;
  const senha_seguranca = document.getElementById('senha_seguranca').value;
  const is_cpf_cnpj     = document.getElementById('is_cpf_cnpj').value;

// Validações básicas

// Validação de e-mail
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert('Por favor, insira um e-mail válido.');
    return;
  }

// Validação de senha
  if (senha.length < 6) {
    alert('A senha deve ter pelo menos 6 caracteres.');
    return;
  }  

if(is_cpf_cnpj == 1){
    if (!razao_social || !usuario || !senha || !email || !senha_seguranca || !cnpj || !endereco) {
        alert('Todos os campos são obrigatórios!');
        return;
      }
    
// Validação de CNPJ (simples)
  if (cnpj.length !== 14 || !validarCNPJ(cnpj)) {
    alert('O CNPJ é inválido.');
    return;
  }  
      ipcRenderer.send('cadastro', { razao_social, usuario, senha, email, senha_seguranca, cnpj, endereco });
}else{
    if (!nome || !usuario || !senha || !email || !senha_seguranca || !data_nascimento || !cpf || !endereco) {
        alert('Todos os campos são obrigatórios!');
        return;
      }

// Validação de CPF (simples)
  if (cpf.length !== 11 || !validarCPF(cpf)) {
    alert('O CPF é inválido.');
    return;
  }
      ipcRenderer.send('cadastro', { nome, usuario, senha, email, senha_seguranca, data_nascimento, cpf, endereco });
}

});

// Receber resposta do backend
ipcRenderer.on('cadastro-reply', (event, response) => {
  if (response.success) {
    window.location = '../Home/home.html';  // Redirecionar para o login
  } else {
    alert('Erro ao cadastrar: ' + response.error);
  }
});

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11) return false;
  
    let soma = 0;
    let resto;
    
    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }
  
  function mascaraCPF(cpfInput) {
    let cpf = cpfInput.value;
  
    // Remove qualquer caractere que não seja número
    cpf = cpf.replace(/\D/g, '');
  
    // Aplica a máscara de CPF (###.###.###-##)
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  
    // Atualiza o valor do input
    cpfInput.value = cpf;
  }

  function validarCNPJ(cnpj) {
 
    cnpj = cnpj.replace(/[^\d]+/g,'');
 
    if(cnpj == '') return false;
     
    if (cnpj.length != 14)
        return false;
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;
           
    return true;
    
}

function MascaraParaLabel(cnpjInput) {
    let cnpj = cnpjInput.value;
    
    cnpj = cnpj.replace(/\D/g, '');

// Aplica a máscara de CNPJ
    valorDoTextBox = valorDoTextBox.replace(/^(\d{2})(\d)/, "$1.$2")
    valorDoTextBox = valorDoTextBox.replace(/^(\d{2})\.(\d{3})(\d)/, "$1 $2 $3")
    valorDoTextBox = valorDoTextBox.replace(/\.(\d{3})(\d)/, ".$1/$2")
    valorDoTextBox = valorDoTextBox.replace(/(\d{4})(\d)/, "$1-$2") 
}