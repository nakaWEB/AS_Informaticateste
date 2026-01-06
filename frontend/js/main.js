// Configuração dos produtos do carrossel (10 produtos manualmente configurados)
const produtosCarrossel = [
    {
        id: 1,
        nome: "Lápis de Cor Premium",
        descricao: "Kit com 24 cores vibrantes",
        imagem: "assets/img/lapis-cor.jpg",
        preco: "R$ 89,90",
        pagina: "frontend/setores/papelaria/lapisdecor.html"
    },
    {
        id: 2,
        nome: "Caderno Universitário",
        descricao: "Capa dura, 200 folhas",
        imagem: "assets/img/caderno.jpg",
        preco: "R$ 45,90",
        pagina: "frontend/setores/papelaria/caderno.html"
    },
    {
        id: 3,
        nome: "Caneta Esferográfica",
        descricao: "Kit com 10 unidades",
        imagem: "assets/img/caneta.jpg",
        preco: "R$ 25,90",
        pagina: "frontend/setores/papelaria/caneta.html"
    },
    {
        id: 4,
        nome: "Mochila Escolar",
        descricao: "Algodão, vários compartimentos",
        imagem: "assets/img/mochila.jpg",
        preco: "R$ 199,90",
        pagina: "frontend/setores/acessorios/mochila.html"
    },
    {
        id: 5,
        nome: "Estojo Escolar",
        descricao: "Com compartimentos organizadores",
        imagem: "assets/img/estojo.jpg",
        preco: "R$ 39,90",
        pagina: "frontend/setores/papelaria/estojo.html"
    },
    {
        id: 6,
        nome: "Regua 30cm",
        descricao: "Material resistente",
        imagem: "assets/img/regua.jpg",
        preco: "R$ 12,90",
        pagina: "frontend/setores/papelaria/regua.html"
    },
    {
        id: 7,
        nome: "Tesoura Escolar",
        descricao: "Ponta arredondada, segurança",
        imagem: "assets/img/tesoura.jpg",
        preco: "R$ 19,90",
        pagina: "frontend/setores/papelaria/tesoura.html"
    },
    {
        id: 8,
        nome: "Cola Bastão",
        descricao: "Pacote com 3 unidades",
        imagem: "assets/img/cola.jpg",
        preco: "R$ 15,90",
        pagina: "frontend/setores/papelaria/cola.html"
    },
    {
        id: 9,
        nome: "Apontador Elétrico",
        descricao: "Bivolt, automático",
        imagem: "assets/img/apontador.jpg",
        preco: "R$ 79,90",
        pagina: "frontend/setores/papelaria/apontador.html"
    },
    {
        id: 10,
        nome: "Massa de Modelar",
        descricao: "12 cores, não tóxica",
        imagem: "assets/img/massa.jpg",
        preco: "R$ 34,90",
        pagina: "frontend/setores/arte/massa.html"
    }
];

let slideAtual = 0;
let intervaloCarrossel;

// Inicializar o carrossel
function inicializarCarrossel() {
    const containerSlides = document.querySelector('.carousel-slides');
    const containerIndicadores = document.querySelector('.carousel-indicators');
    
    // Limpar conteúdo existente
    containerSlides.innerHTML = '';
    containerIndicadores.innerHTML = '';
    
    // Criar slides
    produtosCarrossel.forEach((produto, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='assets/img/produto-padrao.jpg'">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <div class="preco">${produto.preco}</div>
        `;
        
        // Adicionar evento de clique
        slide.addEventListener('click', () => {
            window.location.href = produto.pagina;
        });
        
        containerSlides.appendChild(slide);
        
        // Criar indicador
        const indicador = document.createElement('div');
        indicador.className = 'indicator';
        if (index === 0) indicador.classList.add('active');
        indicador.addEventListener('click', () => irParaSlide(index));
        containerIndicadores.appendChild(indicador);
    });
    
    // Iniciar autoplay
    iniciarAutoplay();
}

// Mover para slide específico
function irParaSlide(index) {
    slideAtual = index;
    atualizarSlide();
    reiniciarAutoplay();
}

// Mover slide anterior/próximo
function moveSlide(direcao) {
    slideAtual += direcao;
    
    if (slideAtual >= produtosCarrossel.length) {
        slideAtual = 0;
    } else if (slideAtual < 0) {
        slideAtual = produtosCarrossel.length - 1;
    }
    
    atualizarSlide();
    reiniciarAutoplay();
}

// Atualizar posição do slide
function atualizarSlide() {
    const slides = document.querySelector('.carousel-slides');
    const indicadores = document.querySelectorAll('.indicator');
    
    slides.style.transform = `translateX(-${slideAtual * 100}%)`;
    
    indicadores.forEach((indicador, index) => {
        indicador.classList.toggle('active', index === slideAtual);
    });
}

// Iniciar autoplay
function iniciarAutoplay() {
    intervaloCarrossel = setInterval(() => {
        moveSlide(1);
    }, 10000); // Muda a cada 10 segundos
}

// Reiniciar autoplay
function reiniciarAutoplay() {
    clearInterval(intervaloCarrossel);
    iniciarAutoplay();
}

// Carregar produtos recomendados
function carregarProdutosRecomendados() {
    const container = document.getElementById('produtos-recomendados');
    
    // Simular produtos baseados em histórico (substitua com lógica real)
    const produtosRecomendados = obterProdutosRecomendados();
    
    container.innerHTML = '';
    
    produtosRecomendados.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='assets/img/produto-padrao.jpg'">
            <h4>${produto.nome}</h4>
            <div class="preco">${produto.preco}</div>
        `;
        
        card.addEventListener('click', () => {
            window.location.href = produto.pagina;
        });
        
        container.appendChild(card);
    });
}

// Função para obter produtos recomendados (simulação)
function obterProdutosRecomendados() {
    // Aqui você pode implementar lógica baseada no histórico do usuário
    // Por enquanto, vamos pegar produtos aleatórios do carrossel
    
    const shuffled = [...produtosCarrossel].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6); // Retorna 6 produtos aleatórios
}

// Inicializar tudo quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrossel();
    carregarProdutosRecomendados();
});

// Pausar autoplay quando o mouse estiver sobre o carrossel
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-wrapper');
    
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(intervaloCarrossel);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        iniciarAutoplay();
    });
});

// Função para rastrear produtos visualizados
function rastrearVisualizacao(produtoId) {
    let historico = JSON.parse(localStorage.getItem('historicoProdutos') || '[]');
    
    // Adicionar ao início e remover duplicados
    historico = [produtoId, ...historico.filter(id => id !== produtoId)];
    
    // Manter apenas os 20 últimos
    historico = historico.slice(0, 20);
    
    localStorage.setItem('historicoProdutos', JSON.stringify(historico));
}

// Modifique a função de redirecionamento para rastrear
function redirecionarParaProduto(produtoId, pagina) {
    rastrearVisualizacao(produtoId);
    window.location.href = pagina;
}