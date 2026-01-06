// debug-search.js
console.log('=== DEBUG DA BARRA DE PESQUISA ===');
console.log('Produtos carregados:', typeof PRODUTOS !== 'undefined' ? PRODUTOS.length : 'ERRO - PRODUTOS não definido');
console.log('SearchEngine carregado:', typeof SearchEngine !== 'undefined' ? 'OK' : 'ERRO');
console.log('RealtimeSearchAdaptado carregado:', typeof RealtimeSearchAdaptado !== 'undefined' ? 'OK' : 'ERRO');

// Teste simples
setTimeout(() => {
    if (typeof realtimeSearch !== 'undefined') {
        console.log('✅ Sistema de busca inicializado com sucesso!');
    } else {
        console.log('❌ Sistema de busca NÃO inicializado');
    }
}, 1000);

// Função de teste rápido
function testarBusca() {
    const query = 'lapis';
    console.log('Testando busca por:', query);
    
    if (typeof searchEngine !== 'undefined') {
        const results = searchEngine.search(query);
        console.log('Resultados encontrados:', results.length);
        console.log('Primeiros resultados:', results.slice(0, 3));
    } else {
        console.log('❌ searchEngine não disponível');
    }
}