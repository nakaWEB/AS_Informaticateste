// search-engine.js
class SearchEngine {
  constructor(products) {
    this.products = products;
  }

  // Buscar produtos
  search(query) {
    if (!query.trim()) return this.products;
    
    const terms = query.toLowerCase().split(' ');
    
    return this.products.filter(product => {
      // Buscar no nome
      const nameMatch = terms.some(term => 
        product.nome.toLowerCase().includes(term)
      );
      
      // Buscar nas tags
      const tagMatch = terms.some(term =>
        product.tags.some(tag => tag.toLowerCase().includes(term))
      );
      
      // Buscar na descrição
      const descMatch = terms.some(term =>
        product.descricao.toLowerCase().includes(term)
      );
      
      return nameMatch || tagMatch || descMatch;
    }).sort((a, b) => {
      // Ordenar por relevância
      const aScore = this.calculateRelevance(a, terms);
      const bScore = this.calculateRelevance(b, terms);
      return bScore - aScore;
    });
  }

  // Calcular relevância
  calculateRelevance(product, terms) {
    let score = 0;
    
    terms.forEach(term => {
      // Nome exato = maior pontuação
      if (product.nome.toLowerCase().includes(term)) {
        score += 10;
      }
      
      // Tag exata = pontuação alta
      if (product.tags.some(tag => tag.toLowerCase() === term)) {
        score += 8;
      }
      
      // Tag parcial = pontuação média
      if (product.tags.some(tag => tag.toLowerCase().includes(term))) {
        score += 5;
      }
      
      // Descrição = pontuação baixa
      if (product.descricao.toLowerCase().includes(term)) {
        score += 2;
      }
    });
    
    // Boost em produtos mais vendidos
    score += product.vendas * 0.01;
    
    return score;
  }

  // Buscar por tag específica
  searchByTag(tag) {
    return this.products.filter(product =>
      product.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // Obter tags populares
  getPopularTags(limit = 10) {
    const tagCount = {};
    
    this.products.forEach(product => {
      product.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([tag]) => tag);
  }
}

// Instanciar busca
const searchEngine = new SearchEngine(PRODUTOS);