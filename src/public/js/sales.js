let totalValue = 0;
let productList = [];

// Função para buscar produtos com base na entrada de texto
async function searchProduct() {
    const searchInput = document.getElementById('searchProduct').value;
    try {
        const response = await fetch(`http://localhost:3001/products?name=${searchInput}`);
        const result = await response.json();

        if (result.success) {
            return result.products[0];  // Retorna o primeiro produto encontrado
        } else {
            alert('Produto não encontrado');
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        return null;
    }
}

// Função para adicionar o produto à lista de compras
document.getElementById('addProduct').addEventListener('click', async () => {
    const product = await searchProduct();
    if (product) {
        addProductToList(product);
    }
});

// Função para adicionar um produto na interface da lista
function addProductToList(product) {
    const productContainer = document.getElementById('product-list');

    // Adiciona o produto à lista de produtos
    productList.push(product);

    // Cria um elemento div para exibir o produto na lista
    const productDiv = document.createElement('div');
    productDiv.classList.add('product-item');
    productDiv.innerHTML = `
        <p>Produto: ${product.name} | Preço: R$ ${product.price} | Quantidade: 1</p>
    `;

    productContainer.appendChild(productDiv);

    // Atualiza o valor total
    totalValue += product.price;
    document.getElementById('totalPrice').value = totalValue.toFixed(2);
}

// Função para registrar venda
document.getElementById('salesForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const sales = productList.map(product => ({
        product_id: product.id,
        quantity: 1,  // Ajustar conforme necessário se a quantidade for modificada
        total_price: product.price
    }));

    try {
        const response = await fetch('http://localhost:3001/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sales })
        });

        const result = await response.json();
        if (result.success) {
            alert('Venda registrada com sucesso!');
            window.location.reload();  // Recarrega a página após registrar a venda
        } else {
            alert('Erro ao registrar venda: ' + result.message);
        }
    } catch (error) {
        console.error('Erro ao registrar venda:', error);
        alert('Erro ao conectar com o servidor.');
    }
});
