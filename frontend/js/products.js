// Buscar produtos
async function getProducts(category = '', search = '') {
    try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);

        const response = await fetch(`http://localhost:3000/api/products?${params}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

// Criar produto (admin)
async function createProduct(productData) {
    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(productData)
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || 'Erro ao criar produto');
        }
    } catch (error) {
        alert('Erro: ' + error.message);
        throw error;
    }
}

// Atualizar produto (admin)
async function updateProduct(productId, productData) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(productData)
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || 'Erro ao atualizar produto');
        }
    } catch (error) {
        alert('Erro: ' + error.message);
        throw error;
    }
}

// Deletar produto (admin)
async function deleteProduct(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || 'Erro ao deletar produto');
        }
    } catch (error) {
        alert('Erro: ' + error.message);
        throw error;
    }
}

// Renderizar produtos
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    
    if (products.length === 0) {
        container.innerHTML = '<p class="text-center">Nenhum produto encontrado.</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card fade-in">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Sem+Imagem'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn-view" onclick="viewProduct('${product._id}')">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    ${isAdmin() ? `
                        <button class="btn-edit" onclick="editProduct('${product._id}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="confirmDeleteProduct('${product._id}')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Verificar se é admin
function isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
}

// Confirmar exclusão de produto
function confirmDeleteProduct(productId) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        deleteProduct(productId).then(() => {
            // Recarregar a página ou remover o card
            location.reload();
        });
    }
}

// Configurar página de setor
async function setupSectorPage(category) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');

    // Carregar produtos
    const products = await getProducts(category, searchTerm);
    
    // Renderizar produtos
    renderProducts(products, 'productsContainer');

    // Configurar pesquisa
    const searchInput = document.getElementById('sectorSearch');
    if (searchInput) {
        searchInput.value = searchTerm || '';
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const search = e.target.value;
                window.location.href = `?search=${encodeURIComponent(search)}`;
            }
        });
    }

    // Configurar formulário de adicionar produto (admin)
    if (isAdmin()) {
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.style.display = 'block';
            addProductForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const productData = {
                    name: document.getElementById('productName').value,
                    description: document.getElementById('productDescription').value,
                    price: parseFloat(document.getElementById('productPrice').value),
                    image: document.getElementById('productImage').value,
                    category: category
                };

                try {
                    await createProduct(productData);
                    alert('Produto criado com sucesso!');
                    location.reload();
                } catch (error) {
                    console.error('Erro ao criar produto:', error);
                }
            });
        }
    }
}

// 🏪 BANCO DE DADOS LOCAL DE PRODUTOS
const PRODUTOS = {
    eletronicos: [
        {
            id: 1,
            nome: "iPhone 15 Pro Max",
            descricao: "Smartphone premium com câmera de 48MP, chip A17 Pro e tela de 6.7",
            preco: 8999.90,
            imagem: "https://via.placeholder.com/300x200/007bff/ffffff?text=iPhone+15",
            ativo: true
        },
        {
            id: 2,
            nome: "MacBook Air M2",
            descricao: "Notebook ultrafino com chip M2, 8GB RAM e 256GB SSD",
            preco: 8999.90,
            imagem: "https://via.placeholder.com/300x200/28a745/ffffff?text=MacBook",
            ativo: true
        },
        {
            id: 3,
            nome: "Samsung Galaxy S24",
            descricao: "Android premium com IA avançada e câmera profissional",
            preco: 4999.90,
            imagem: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Galaxy+S24",
            ativo: true
        },
        {
            id: 4,
            nome: "iPad Pro 12.9",
            descricao: "Tablet profissional com chip M2 e tela Liquid Retina",
            preco: 6999.90,
            imagem: "https://via.placeholder.com/300x200/ffc107/ffffff?text=iPad+Pro",
            ativo: true
        }
    ],
    moveis: [
        {
            id: 5,
            nome: "Sofá Retratil 3 Lugares",
            descricao: "Sofá em couro sintético com reclinação elétrica",
            preco: 2999.90,
            imagem: "https://via.placeholder.com/300x200/6c757d/ffffff?text=Sofá",
            ativo: true
        },
        {
            id: 6,
            nome: "Mesa de Jantar 8 Lugares",
            descricao: "Mesa em madeira maciça com acabamento em laca",
            preco: 3499.90,
            imagem: "https://via.placeholder.com/300x200/7952b3/ffffff?text=Mesa+Jantar",
            ativo: true
        },
        {
            id: 7,
            nome: "Cama King Size Box",
            descricao: "Cama box king size com colchão ortopédico",
            preco: 4999.90,
            imagem: "https://via.placeholder.com/300x200/198754/ffffff?text=Cama+King",
            ativo: true
        },
        {
            id: 8,
            nome: "Guarda-Roupa 6 Portas",
            descricao: "Guarda-roupa espaçoso com espelhos e gavetas",
            preco: 4299.90,
            imagem: "https://via.placeholder.com/300x200/0dcaf0/ffffff?text=Guarda-Roupa",
            ativo: true
        }
    ],
    roupas: [
        {
            id: 9,
            nome: "Jaqueta de Couro Legítimo",
            descricao: "Jaqueta em couro legítimo com forro térmico",
            preco: 899.90,
            imagem: "https://via.placeholder.com/300x200/d63384/ffffff?text=Jaqueta",
            ativo: true
        },
        {
            id: 10,
            nome: "Calça Jeans Premium",
            descricao: "Calça jeans de alta qualidade com stretch",
            preco: 299.90,
            imagem: "https://via.placeholder.com/300x200/fd7e14/ffffff?text=Calça+Jeans",
            ativo: true
        },
        {
            id: 11,
            nome: "Vestido de Gala",
            descricao: "Vestido elegante para ocasiões especiais",
            preco: 1299.90,
            imagem: "https://via.placeholder.com/300x200/20c997/ffffff?text=Vestido",
            ativo: true
        },
        {
            id: 12,
            nome: "Camisa Social Italiana",
            descricao: "Camisa social de algodão egípcio",
            preco: 399.90,
            imagem: "https://via.placeholder.com/300x200/17a2b8/ffffff?text=Camisa",
            ativo: true
        }
    ],
    alimentos: [
        {
            id: 13,
            nome: "Café Especial Grãos",
            descricao: "Café grãos 100% arábica, torra média",
            preco: 59.90,
            imagem: "https://via.placeholder.com/300x200/6f4e37/ffffff?text=Café",
            ativo: true
        },
        {
            id: 14,
            nome: "Chocolate Suíço 70% Cacau",
            descricao: "Chocolate belga artesanal 200g",
            preco: 49.90,
            imagem: "https://via.placeholder.com/300x200/8b4513/ffffff?text=Chocolate",
            ativo: true
        },
        {
            id: 15,
            nome: "Vinho Tinto Premium",
            descricao: "Vinho tinto reserva safra 2019",
            preco: 189.90,
            imagem: "https://via.placeholder.com/300x200/722f37/ffffff?text=Vinho",
            ativo: true
        },
        {
            id: 16,
            nome: "Azeite Extra Virgem",
            preco: 79.90,
            descricao: "Azeite de oliva prensado a frio 500ml",
            imagem: "https://via.placeholder.com/300x200/9acd32/ffffff?text=Azeite",
            ativo: true
        }
    ]
};

// 🔍 FUNÇÃO PARA PESQUISAR PRODUTOS
function buscarProdutos(termo = '', setor = '') {
    let produtos = [];
    
    if (setor && PRODUTOS[setor]) {
        produtos = PRODUTOS[setor];
    } else {
        // Busca em todos os setores
        Object.values(PRODUTOS).forEach(setorProdutos => {
            produtos = produtos.concat(setorProdutos);
        });
    }
    
    if (termo) {
        produtos = produtos.filter(produto => 
            produto.nome.toLowerCase().includes(termo.toLowerCase()) ||
            produto.descricao.toLowerCase().includes(termo.toLowerCase())
        );
    }
    
    return produtos.filter(produto => produto.ativo);
}

// 🎯 FUNÇÃO PARA CARREGAR PRODUTOS NA PÁGINA
function carregarProdutos(setor = '', containerId = 'productsContainer') {
    const produtos = buscarProdutos('', setor);
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    if (produtos.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">Nenhum produto encontrado.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = produtos.map(produto => `
        <div class="col-lg-4 col-md-6 mb-4 fade-in">
            <div class="product-card">
                <img src="${produto.imagem}" alt="${produto.nome}" class="product-image">
                <div class="card-body">
                    <h5 class="card-title">${produto.nome}</h5>
                    <p class="card-text">${produto.descricao}</p>
                    <p class="text-primary fw-bold fs-4">R$ ${produto.preco.toFixed(2)}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary flex-fill" onclick="verDetalhes(${produto.id})">
                            <i class="bi bi-eye"></i> Ver Detalhes
                        </button>
                        <button class="btn btn-outline-danger" onclick="toggleFavorito(${produto.id})">
                            <i class="bi bi-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 📱 FUNÇÃO PARA CARREGAR PRODUTOS EM DESTAQUE (HOME)
function carregarProdutosDestaque() {
    const produtosDestaque = [
        ...PRODUTOS.eletronicos.slice(0, 2),
        ...PRODUTOS.moveis.slice(0, 1),
        ...PRODUTOS.roupas.slice(0, 1)
    ];
    
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    container.innerHTML = produtosDestaque.map(produto => `
        <div class="col-lg-3 col-md-6 mb-4 fade-in">
            <div class="product-card">
                <img src="${produto.imagem}" alt="${produto.nome}" class="product-image">
                <div class="card-body">
                    <h5 class="card-title">${produto.nome}</h5>
                    <p class="card-text">${produto.descricao.substring(0, 80)}...</p>
                    <p class="text-primary fw-bold">R$ ${produto.preco.toFixed(2)}</p>
                    <button class="btn btn-outline-primary btn-sm w-100">Ver Produto</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 🔎 FUNÇÃO DE PESQUISA GLOBAL
function pesquisarProdutos(termo) {
    if (!termo.trim()) {
        showMessage('Digite um termo para pesquisar', 'warning');
        return;
    }
    
    const resultados = buscarProdutos(termo);
    localStorage.setItem('ultimaPesquisa', JSON.stringify({termo, resultados}));
    window.location.href = 'resultados-pesquisa.html';
}

// ❤️ FUNÇÃO DE FAVORITOS
function toggleFavorito(produtoId) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const index = favoritos.indexOf(produtoId);
    
    if (index > -1) {
        favoritos.splice(index, 1);
        showMessage('Produto removido dos favoritos', 'info');
    } else {
        favoritos.push(produtoId);
        showMessage('Produto adicionado aos favoritos', 'success');
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    atualizarIconeFavorito(produtoId);
}

// 🛠️ FUNÇÕES AUXILIARES
function verDetalhes(produtoId) {
    // Encontra o produto
    let produto = null;
    for (const setor of Object.values(PRODUTOS)) {
        produto = setor.find(p => p.id === produtoId);
        if (produto) break;
    }
    
    if (produto) {
        localStorage.setItem('produtoDetalhe', JSON.stringify(produto));
        window.location.href = 'produto-detalhe.html';
    }
}

function atualizarIconeFavorito(produtoId) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const isFavorito = favoritos.includes(produtoId);
    const botao = document.querySelector(`[onclick="toggleFavorito(${produtoId})"]`);
    
    if (botao) {
        const icon = botao.querySelector('i');
        if (isFavorito) {
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill', 'text-danger');
        } else {
            icon.classList.add('bi-heart');
            icon.classList.remove('bi-heart-fill', 'text-danger');
        }
    }
}

// 📊 ESTATÍSTICAS
function getEstatisticas() {
    const stats = {
        total: 0,
        porSetor: {},
        mediaPreco: 0,
        totalValor: 0
    };
    
    let somaPrecos = 0;
    
    for (const [setor, produtos] of Object.entries(PRODUTOS)) {
        const ativos = produtos.filter(p => p.ativo);
        stats.porSetor[setor] = ativos.length;
        stats.total += ativos.length;
        ativos.forEach(p => {
            somaPrecos += p.preco;
            stats.totalValor += p.preco;
        });
    }
    
    stats.mediaPreco = stats.total > 0 ? somaPrecos / stats.total : 0;
    return stats;
}

// 🔄 ATUALIZAR PRODUTO (PARA ADMINS)
function atualizarProduto(produtoId, novosDados) {
    for (const setor of Object.values(PRODUTOS)) {
        const index = setor.findIndex(p => p.id === produtoId);
        if (index > -1) {
            setor[index] = { ...setor[index], ...novosDados };
            showMessage('Produto atualizado com sucesso!', 'success');
            return true;
        }
    }
    return false;
}

// Função para carregar produtos aleatórios
function carregarProdutosAleatorios(containerId = 'conteiner-produtos', quantidade = 6) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Pega todos os produtos de todos os setores
    const todosProdutos = Object.values(PRODUTOS).flat();
    
    // Embaralha e pega a quantidade desejada
    const produtosAleatorios = todosProdutos
        .sort(() => 0.5 - Math.random())
        .slice(0, quantidade);

    // Renderiza os produtos
    container.innerHTML = produtosAleatorios.map(produto => `
        <div class="col-lg-4 col-md-6 mb-4 fade-in">
            <div class="product-card">
                <img src="${produto.imagem}" alt="${produto.nome}" class="product-image">
                <div class="card-body">
                    <h5 class="card-title">${produto.nome}</h5>
                    <p class="card-text">${produto.descricao.substring(0, 80)}...</p>
                    <p class="text-primary fw-bold">R$ ${produto.preco.toFixed(2)}</p>
                    <button class="btn btn-outline-primary btn-sm w-100" onclick="verDetalhes(${produto.id})">
                        Ver Produto
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}