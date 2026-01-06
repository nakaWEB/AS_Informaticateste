// router.js
class ProductRouter {
  constructor() {
    this.products = PRODUTOS;
    this.currentProduct = null;
  }

  // Inicializar rotas
  init() {
    // Verificar URL ao carregar
    this.checkRoute();
    
    // Ouvir mudanças de URL (sem reload)
    window.addEventListener('popstate', () => this.checkRoute());
  }

  // Verificar rota atual
  checkRoute() {
    const path = window.location.pathname;
    const productId = this.extractProductId(path);
    
    if (productId) {
      this.showProduct(productId);
    } else {
      this.showProductList();
    }
  }

  // Extrair ID do produto da URL
  extractProductId(path) {
    const match = path.match(/\/produto\/(.+)/);
    return match ? match[1] : null;
  }

  // Navegar para produto
  navigateToProduct(productId) {
    history.pushState(null, null, `/produto/${productId}`);
    this.showProduct(productId);
  }

  // Mostrar produto individual
  showProduct(productId) {
    const product = this.products.find(p => p.id === productId);
    
    if (!product) {
      this.show404();
      return;
    }

    this.currentProduct = product;
    this.renderProductModal(product);
  }

  // Renderizar modal do produto
  renderProductModal(product) {
    const modal = document.createElement('div');
    modal.id = 'product-modal';
    modal.className = 'product-modal';
    modal.innerHTML = `
      <div class="product-modal-overlay" onclick="router.closeModal()">
        <div class="product-modal-content" onclick="event.stopPropagation()">
          <button class="product-modal-close" onclick="router.closeModal()">
            <i class="fas fa-times"></i>
          </button>
          
          <div class="product-modal-body">
            <div class="product-modal-gallery">
              <img src="${product.imagem}" alt="${product.nome}" class="product-modal-main-image">
              <div class="product-modal-thumbnails">
                <img src="${product.imagem}" alt="${product.nome}" class="thumbnail active">
                <!-- Adicionar mais imagens se houver -->
              </div>
            </div>
            
            <div class="product-modal-info">
              <h1 class="product-modal-title">${product.nome}</h1>
              
              <div class="product-modal-rating">
                <span class="stars">${'★'.repeat(Math.floor(product.avaliacao))}</span>
                <span class="rating-value">${product.avaliacao}</span>
                <span class="rating-count">(${product.vendas} vendas)</span>
              </div>
              
              <div class="product-modal-price">
                <span class="price-current">R$ ${product.preco.toFixed(2)}</span>
                ${product.precoOriginal ? `<span class="price-original">R$ ${product.precoOriginal.toFixed(2)}</span>` : ''}
              </div>
              
              <div class="product-modal-description">
                <p>${product.descricao}</p>
              </div>
              
              <div class="product-modal-tags">
                ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
              
              <div class="product-modal-actions">
                <div class="quantity-selector">
                  <button onclick="router.updateQuantity(-1)">-</button>
                  <input type="number" id="product-quantity" value="1" min="1" max="${product.estoque}">
                  <button onclick="router.updateQuantity(1)">+</button>
                </div>
                
                <button class="btn-add-cart" onclick="router.addToCart('${product.id}')">
                  <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                </button>
                
                <button class="btn-favorite" onclick="router.toggleFavorite('${product.id}')">
                  <i class="far fa-heart"></i>
                </button>
              </div>
              
              <div class="product-modal-estoque">
                <span class="estoque-status ${product.estoque > 0 ? 'disponivel' : 'indisponivel'}">
                  ${product.estoque > 0 ? `✓ ${product.estoque} em estoque` : '✗ Indisponível'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animar entrada
    setTimeout(() => modal.classList.add('show'), 10);
  }

  // Fechar modal
  closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
        history.back();
      }, 300);
    }
  }

  // Atualizar quantidade
  updateQuantity(change) {
    const input = document.getElementById('product-quantity');
    const newValue = parseInt(input.value) + change;
    
    if (newValue >= 1 && newValue <= parseInt(input.max)) {
      input.value = newValue;
    }
  }

  // Adicionar ao carrinho
  addToCart(productId) {
    const quantity = document.getElementById('product-quantity').value;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.push({
        id: productId,
        quantity: parseInt(quantity),
        addedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    this.showMessage(`Produto adicionado ao carrinho! (${quantity}x)`);
  }

  // Mostrar mensagem
  showMessage(text) {
    const message = document.createElement('div');
    message.className = 'product-message';
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => message.classList.add('show'), 10);
    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => message.remove(), 300);
    }, 2000);
  }
}

// Instanciar router
const router = new ProductRouter();