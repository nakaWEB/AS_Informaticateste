// search-realtime.js
class RealtimeSearch {
    constructor() {
        this.searchInput = document.getElementById('globalSearch');
        this.suggestionsContainer = document.getElementById('searchSuggestions');
        this.products = PRODUTOS; // Seu array de produtos
        this.searchEngine = new SearchEngine(this.products);
        this.selectedIndex = -1;
        this.debounceTimer = null;
        
        this.init();
    }
    
    init() {
        // Eventos de input
        this.searchInput.addEventListener('input', (e) => this.handleInput(e));
        this.searchInput.addEventListener('focus', () => this.showSuggestions());
        this.searchInput.addEventListener('blur', () => {
            // Delay para permitir clique nas sugestões
            setTimeout(() => this.hideSuggestions(), 200);
        });
        
        // Navegação por teclado
        this.searchInput.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Clique fora fecha sugestões
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.suggestionsContainer.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }
    
    handleInput(e) {
        const query = e.target.value.trim();
        
        // Debounce para não pesquisar a cada caractere
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            if (query.length >= 1) { // Começa a buscar com 1 caractere
                this.updateSuggestions(query);
            } else {
                this.hideSuggestions();
            }
        }, 200);
    }
    
    updateSuggestions(query) {
        const results = this.searchEngine.search(query);
        const html = this.buildSuggestionsHTML(results, query);
        
        this.suggestionsContainer.innerHTML = html;
        this.showSuggestions();
        this.selectedIndex = -1;
    }
    
    buildSuggestionsHTML(results, query) {
        if (results.length === 0) {
            return '<div class="suggestion-item">Nenhum resultado encontrado</div>';
        }
        
        let html = '';
        
        // Produtos encontrados
        const productsFound = results.slice(0, 6); // Máximo 6 produtos
        if (productsFound.length > 0) {
            html += '<div class="suggestion-section">Produtos</div>';
            productsFound.forEach(product => {
                html += this.buildProductSuggestion(product, query);
            });
        }
        
        // Tags relacionadas
        const relatedTags = this.getRelatedTags(query);
        if (relatedTags.length > 0) {
            html += '<div class="suggestion-section">Tags</div>';
            relatedTags.forEach(tag => {
                html += this.buildTagSuggestion(tag, query);
            });
        }
        
        return html;
    }
    
    buildProductSuggestion(product, query) {
        const highlightedName = this.highlightText(product.nome, query);
        const price = product.preco.toFixed(2);
        
        return `
            <div class="suggestion-item" onclick="selectProduct('${product.id}')">
                <div class="suggestion-product">
                    <img src="${product.imagem}" alt="${product.nome}">
                    <div class="suggestion-product-info">
                        <div class="suggestion-product-name">${highlightedName}</div>
                        <div class="suggestion-product-price">R$ ${price}</div>
                        <div class="suggestion-tags">
                            ${product.tags.slice(0, 3).map(tag => 
                                `<span class="suggestion-tag">${tag}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    buildTagSuggestion(tag, query) {
        const highlightedTag = this.highlightText(tag, query);
        
        return `
            <div class="suggestion-item" onclick="selectTag('${tag}')">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-tag" style="color: #007bff;"></i>
                    <span>${highlightedTag}</span>
                    <small style="color: #666; margin-left: auto;">
                        (${this.getProductCountByTag(tag)} produtos)
                    </small>
                </div>
            </div>
        `;
    }
    
    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="suggestion-highlight">$1</span>');
    }
    
    getRelatedTags(query) {
        const allTags = new Set();
        this.products.forEach(product => {
            product.tags.forEach(tag => {
                if (tag.toLowerCase().includes(query.toLowerCase())) {
                    allTags.add(tag);
                }
            });
        });
        return Array.from(allTags).slice(0, 5); // Máximo 5 tags
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
        
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
            items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }
    
    showSuggestions() {
        this.suggestionsContainer.classList.remove('hidden');
    }
    
    hideSuggestions() {
        this.suggestionsContainer.classList.add('hidden');
        this.selectedIndex = -1;
    }
    
    performSearch() {
        const query = this.searchInput.value.trim();
        if (query) {
            const results = this.searchEngine.search(query);
            renderProducts(results); // Sua função de renderizar produtos
            this.hideSuggestions();
            
            // Scroll para os resultados
            document.getElementById('productsGrid').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }
    }
}

// Funções globais para seleção
function selectProduct(productId) {
    router.navigateToProduct(productId); // Sua função de roteamento
}

function selectTag(tag) {
    searchByTag(tag); // Sua função de busca por tag
}

// Inicializar busca em tempo real
const realtimeSearch = new RealtimeSearch();

// Manter função original do botão
function performGlobalSearch() {
    realtimeSearch.performSearch();
}