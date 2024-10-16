document.getElementById('category').addEventListener('change', function () {
    const subcategoryContainer = document.getElementById('subcategory-container');
    if (this.value === 'product') {
        subcategoryContainer.style.display = 'block';
    } else {
        subcategoryContainer.style.display = 'none';
    }
});

// Função para gerar gráficos de vendas
async function renderSalesCharts() {
    try {
        const response = await fetch('http://localhost:3001/sales');
        const result = await response.json();

        if (result.success) {
            const salesData = result.sales;

            // Processa os dados de vendas diárias e mensais
            const dailySales = [0, 0, 0, 0, 0, 0, 0]; // Array para os dias da semana
            const monthlySales = new Array(12).fill(0); // Array para os meses

            salesData.forEach(sale => {
                const saleDate = new Date(sale.sale_date);
                const day = saleDate.getDay(); // Pega o dia da semana (0-6)
                const month = saleDate.getMonth(); // Pega o mês (0-11)

                dailySales[day] += sale.total_price;
                monthlySales[month] += sale.total_price;
            });

            // Atualiza o gráfico de vendas diárias
            const dailySalesCtx = document.getElementById('dailySalesChart').getContext('2d');
            new Chart(dailySalesCtx, {
                type: 'bar',
                data: {
                    labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                    datasets: [{
                        label: 'Vendas Diárias',
                        data: dailySales,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                }
            });

            // Atualiza o gráfico de vendas mensais
            const monthlySalesCtx = document.getElementById('monthlySalesChart').getContext('2d');
            new Chart(monthlySalesCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    datasets: [{
                        label: 'Vendas Mensais',
                        data: monthlySales,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    }]
                }
            });
        } else {
            console.error('Erro ao obter vendas: ', result.message);
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
    }
}


const form = document.getElementById('productForm');
if (!form) {
    console.log('Formulário não encontrado!');
} else {
    const form = document.getElementById('productForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();  // Previne o comportamento padrão do formulário

        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('price', document.getElementById('price').value);
        formData.append('amount', document.getElementById('amount').value);
        formData.append('category', document.getElementById('category').value);
        formData.append('image', document.getElementById('image').files[0]);


        const offersChecked = document.getElementById('offers').checked ? 1 : 0;
        const couponsChecked = document.getElementById('coupons').checked ? 1 : 0;
        formData.append('offers', offersChecked);
        formData.append('coupons', couponsChecked);

        try {
            const response = await fetch('http://localhost:3001/products', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const result = await response.json();
            if (result.success) {
                alert('Produto cadastrado com sucesso!');
            } else {
                alert('Erro ao cadastrar produto: ' + result.message);
            }
        } catch (error) {
            console.error('Erro ao conectar com o servidor:', error);
            alert('Erro ao conectar com o servidor.');
        }
    });
}

document.getElementById('salesForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        product_id: document.getElementById('product').value,
        quantity: document.getElementById('quantity').value,
        total_price: document.getElementById('totalPrice').value
    };

    try {
        const response = await fetch('http://localhost:3001/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
            alert('Venda registrada com sucesso!');
        } else {
            alert('Erro ao registrar venda: ' + result.message);
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        alert('Erro ao conectar com o servidor.');
    }
});

// Renderiza os gráficos quando a página é carregada
window.onload = renderSalesCharts;
