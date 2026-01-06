// render-products.js
function renderProducts(products = PRODUTOS) {
  const grid = document.getElementById('productsGrid');
  
  grid.innerHTML = products.map(product => `
    <div class="product-card" onclick="router.navigateToProduct('${product.id}')">
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

// Busca em tempo real
function performSearch() {
  const query = document.getElementById('searchInput').value;
  const results = searchEngine.search(query);
  renderProducts(results);
}

// Tags populares
function renderPopularTags() {
  const tags = searchEngine.getPopularTags(8);
  const container = document.getElementById('popularTags');
  
  container.innerHTML = tags.map(tag => 
    `<button class="tag-button" onclick="searchByTag('${tag}')">${tag}</button>`
  ).join('');
}

// Buscar por tag
function searchByTag(tag) {
  document.getElementById('searchInput').value = tag;
  const results = searchEngine.searchByTag(tag);
  renderProducts(results);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderPopularTags();
  
  // Busca em tempo real
  document.getElementById('searchInput').addEventListener('input', 
    debounce(performSearch, 300)
  );
  
  // Inicializar router
  router.init();
});

// Função debounce para performance
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