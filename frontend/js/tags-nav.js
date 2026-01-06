function renderTagsNav() {
    const container = document.getElementById('tagsContainer');
    const tags = searchEngine.getPopularTags(12); // Pega as 12 tags mais populares
    
    container.innerHTML = tags.map(tag => 
        `<li><a href="#" onclick="searchByTag('${tag}'); return false;">${tag}</a></li>`
    ).join('');
}

// Função para buscar por tag (já existe no código anterior)
function searchByTag(tag) {
    document.getElementById('searchInput').value = tag;
    const results = searchEngine.searchByTag(tag);
    renderProducts(results);
    
    // Scroll suave para os resultados
    document.getElementById('productsGrid').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Inicializar quando carregar a página
document.addEventListener('DOMContentLoaded', () => {
    renderTagsNav();
});