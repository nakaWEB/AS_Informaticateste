// search-realtime-adaptado.js
class RealtimeSearchAdaptado {
    constructor() {
        this.searchInput = document.getElementById('globalSearch');
        this.suggestionsContainer = document.getElementById('searchSuggestions');
        this.products = PRODUTOS; // Seu array de produtos
        this.selectedIndex = -1;
        this.debounceTimer = null;
        
        this.init();
    }
    
    init() {
        // Eventos de input
        this.searchInput.addEventListener('input', (e) => this.handleInput(e));
        this.searchInput.addEventListener('focus', () => this.showSuggestions());
        
        // Navegação por teclado
        this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Prevenir submit do formulário
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch();
            }
        });
    }
    
    handleInput(e) {
        const query = e.target.value.trim();
        
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            if (query.length >= 1) {
                this.updateSuggestions(query);
            } else {
                this.hideSuggestions();
            }
        }, 300);
    }
    
    updateSuggestions(query) {
        // Busca produtos que correspondem à query
        const matchingProducts = this.searchProducts(query);
        const matchingTags = this.searchTags(query);
        
        const html = this.buildSuggestionsHTML(matchingProducts, matchingTags, query);
        
        this.suggestionsContainer.innerHTML = html;
        this.showSuggestions();
        this.selectedIndex = -1;
    }
    
    searchProducts(query) {
        const queryLower = query.toLowerCase();
        return this.products.filter(product => 
            product.nome.toLowerCase().includes(queryLower) ||
            product.descricao.toLowerCase().includes(queryLower)
        ).slice(0, 4); // Máximo 4 produtos
    }
    
    searchTags(query) {
        const queryLower = query.toLowerCase();
        const allTags = new Set();
        
        this.products.forEach(product => {
            product.tags.forEach(tag => {
                if (tag.toLowerCase().includes(queryLower)) {
                    allTags.add(tag);
                }
            });
        });
        
        return Array.from(allTags).slice(0, 6); // Máximo 6 tags
    }
    
    buildSuggestionsHTML(products, tags, query) {
        let html = '';
        
        // Produtos encontrados
        if (products.length > 0) {
            html += '<div class="suggestion-section">Produtos</div>';
            products.forEach(product => {
                html += this.buildProductSuggestion(product, query);
            });
        }
        
        // Tags encontradas
        if (tags.length > 0) {
            html += '<div class="suggestion-section">Tags</div>';
            tags.forEach(tag => {
                html += this.buildTagSuggestion(tag, query);
            });
        }
        
        // Se nada encontrado
        if (products.length === 0 && tags.length === 0) {
            html = '<div class="suggestion-item">Nenhum resultado encontrado</div>';
        }
        
        return html;
    }
    
    buildProductSuggestion(product, query) {
        const highlightedName = this.highlightText(product.nome, query);
        
        return `
            <div class="suggestion-item" onclick="selectProductSuggestion('${product.id}')">
                <div class="suggestion-product">
                    <img src="${product.imagem}" alt="${product.nome}">
                    <div class="suggestion-product-info">
                        <div class="suggestion-product-name">${highlightedName}</div>
                        <div class="suggestion-product-price">R$ ${product.preco.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    buildTagSuggestion(tag, query) {
        const highlightedTag = this.highlightText(tag, query);
        const count = this.getProductCountByTag(tag);
        
        return `
            <div class="suggestion-item" onclick="selectTagSuggestion('${tag}')">
                <div class="suggestion-tag">
                    <i class="fas fa-tag"></i>
                    <span>${highlightedTag}</span>
                    <small>(${count})</small>
                </div>
            </div>
        `;
    }
    
    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="suggestion-highlight">$1</span>');
    }
    
    getProductCountByTag(tag) {
        return this.products.filter(p => p.tags.includes(tag)).length;
    }
    
    handleKeydown(e) {
        const items = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                this.updateSelectedItem(items);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelectedItem(items);
                break;
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
                    items[this.selectedIndex].click();
                } else {
                    this.performSearch();
                }
                break;
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }
    
    updateSelectedItem(items) {
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.selectedIndex);
        });
    }
    
    showSuggestions() {
        this.suggestionsContainer.style.display = 'block';
    }
    
    hideSuggestions() {
        this.suggestionsContainer.style.display = 'none';
        this.selectedIndex = -1;
    }
    
    performSearch() {
        const query = this.searchInput.value.trim();
        if (query) {
            const results = this.searchEngine.search(query);
            renderProducts(results); // Sua função existente
            this.hideSuggestions();
        }
    }
}

// Funções globais para seleção
function selectProductSuggestion(productId) {
    // Redirecionar para o produto
    if (typeof router !== 'undefined') {
        router.navigateToProduct(productId);
    } else {
        // Fallback simples
        window.location.href = `#produto/${productId}`;
    }
}

function selectTagSuggestion(tag) {
    // Buscar por tag
    const results = searchEngine.searchByTag(tag);
    renderProducts(results);
    
    // Atualizar input
    document.getElementById('globalSearch').value = tag;
}

// Inicializar busca em tempo real
const realtimeSearch = new RealtimeSearchAdaptado();

// Manter função original do botão
function performGlobalSearch() {
    realtimeSearch.performSearch();
}