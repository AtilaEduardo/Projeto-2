
// Função para buscar e preencher o histórico de vendas
async function fetchSalesHistory() {
    try {
        const response = await fetch('http://localhost:3001/sales'); // Modifique o caminho para sua API de vendas
        const result = await response.json();

        if (result.success) {
            const salesList = document.getElementById('salesList');
            salesList.innerHTML = '';
            result.sales.forEach(sale => {
                const saleItem = document.createElement('div');
                saleItem.classList.add('sale-item');
                saleItem.innerHTML = `
                    <p>Produto ID: ${sale.product_id}, Quantidade: ${sale.quantity}, Preço Total: ${sale.total_price}, Data: ${sale.sale_date}</p>
                `;
                salesList.appendChild(saleItem);
            });
        } else {
            console.error('Erro ao buscar histórico de vendas:', result.message);
        }
    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
    }
}

// Carrega o histórico de vendas quando a página é carregada
window.onload = function() {
    fetchSalesHistory();
};