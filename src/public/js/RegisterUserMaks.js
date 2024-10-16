function mascaraCNPJ(cnpjInput) {
    let cnpj = cnpjInput.value.replace(/\D/g, '');
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
    cnpjInput.value = cnpj;
}

function mascaraTelefone(telefoneInput) {
    let telefone = telefoneInput.value.replace(/\D/g, ''); 
    telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
    telefoneInput.value = telefone;
}

function mascaraCEP(cepInput) {
    let cep = cepInput.value.replace(/\D/g, ''); 
    cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
    cepInput.value = cep; 
}

function validarEmail(emailInput) {
    const email = emailInput.value;
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) {
        alert("E-mail inválido");
    }
}

document.getElementById('cep').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('neighborhood').value = data.bairro;
                    document.getElementById('city').value = data.localidade;
                    document.getElementById('uf').value = data.uf;
                } else {
                    alert("CEP não encontrado.");
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                alert('Erro ao buscar CEP.');
            });
    } else {
        alert('CEP inválido');
    }
});
