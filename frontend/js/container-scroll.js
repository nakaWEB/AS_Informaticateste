// container-scroll.js
document.addEventListener('DOMContentLoaded', function() {
    // Renderiza produtos dentro do container scrollável
    function renderProductsScroll(products = PRODUTOS) {
        const grid = document.getElementById('productsGrid');
        
        grid.innerHTML = products.map(product => `
            <div class="product-card" onclick="selectProduct('${product.id}')">
                <img src="${product.imagem}" alt="${product.nome}" class="product-card-image">
                <div class="product-card-content">
                    <h3 class="product-card-title">${product.nome}</h3>
                    <div class="product-card-price">R$ ${product.preco.toFixed(2)}</div>
                    <div class="product-card-tags">
                        ${product.tags.slice(0, 3).map(tag => 
                            `<span class="product-card-tag">${tag}</span>`
                        ).join('')}
                    </div>
                    <div class="product-card-stats">
                        <span class="product-card-rating">
                            <i class="fas fa-star"></i> ${product.avaliacao}
                        </span>
                        <span>${product.vendas} vendas</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Busca com scroll suave para resultados
    function performSearch() {
        const query = document.getElementById('searchInput').value;
        const results = searchEngine.search(query);
        renderProductsScroll(results);
        
        // Scroll suave para o início dos resultados
        const container = document.querySelector('.products-container');
        container.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Busca por tag com scroll suave
    function searchByTag(tag) {
        document.getElementById('searchInput').value = tag;
        const results = searchEngine.searchByTag(tag);
        renderProductsScroll(results);
        
        // Scroll para topo
        const container = document.querySelector('.products-container');
        container.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Renderiza tags populares
    function renderPopularTags() {
        const tags = searchEngine.getPopularTags(8);
        const container = document.getElementById('popularTags');
        
        container.innerHTML = tags.map(tag => 
            `<button class="tag-button" onclick="searchByTag('${tag}')">${tag}</button>`
        ).join('');
    }

    // Inicializar
    renderProductsScroll();
    renderPopularTags();

    // Event listeners
    document.getElementById('searchInput').addEventListener('input', 
        debounce(performSearch, 300)
    );

    // Previne scroll da página quando chegar no fim do container
    const productsContainer = document.querySelector('.products-container');
    
    productsContainer.addEventListener('wheel', function(e) {
        const delta = e.deltaY;
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight;
        const clientHeight = this.clientHeight;
        
        // Se está no topo e tentando scrollar para cima, previne
        if (scrollTop === 0 && delta < 0) {
            e.preventDefault();
        }
        
        // Se está no fim e tentando scrollar para baixo, previne
        if (scrollTop + clientHeight >= scrollHeight && delta > 0) {
            e.preventDefault();
        }
    });
});

// Função debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para seleção de produto
function selectProduct(productId) {
    if (typeof router !== 'undefined') {
        router.navigateToProduct(productId);
    } else {
        console.log('Produto selecionado:', productId);
        // Fallback simples
        alert(`Produto: ${productId}`);
    }
}