// Mask for CPF input
function maskCPF(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
}

// Mask for phone input
function maskPhone(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    input.value = value;
}

// Add input masks to form fields
document.addEventListener('DOMContentLoaded', () => {
    const cpfInput = document.getElementById('cpf');
    const phoneInput = document.getElementById('telefone');

    if (cpfInput) {
        cpfInput.addEventListener('input', () => maskCPF(cpfInput));
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', () => maskPhone(phoneInput));
    }
});

// Handle registration form submission
function handleCadastro(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Here you would typically send this data to your backend
    console.log('Dados do cadastro:', data);
    
    // For demonstration, we'll store in localStorage
    localStorage.setItem('userData', JSON.stringify(data));
    
    // Redirect to login page
    alert('Cadastro realizado com sucesso!');
    window.location.href = 'login.html';
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Here you would typically validate with your backend
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (userData.email === data.email && userData.senha === data.senha) {
        alert('Login realizado com sucesso!');
        window.location.href = 'index.html';
    } else {
        alert('Email ou senha incorretos!');
    }
}