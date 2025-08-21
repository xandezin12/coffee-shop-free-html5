/**
 * Script de Limpeza - Coffee Shop
 * Remove arquivos desnecessários e organiza o projeto
 */

// Lista de arquivos que podem ser removidos (duplicados/desnecessários)
const filesToRemove = [
    // JavaScript duplicados/desnecessários
    'assets/js/enhanced-auth.js',           // Substituído por coffee-shop-app.js
    'assets/js/database-auth.js',           // Não usado
    'assets/js/simple-api-manager.js',      // Integrado em coffee-shop-app.js
    'assets/js/google-cloud-manager.js',    // Integrado em coffee-shop-app.js
    'assets/js/google-integration.js',      // Integrado em coffee-shop-app.js
    'assets/js/api-examples.js',            // Integrado em coffee-shop-app.js
    'assets/js/google-apis-manager.js',     // Duplicado
    'assets/js/google-business-api.js',     // Não usado
    'assets/js/enhanced-maps.js',           // Integrado
    'assets/js/analytics-manager.js',       // Opcional
    'assets/js/button-manager.js',          // Não essencial
    'assets/js/interactions.js',            // Não essencial
    
    // Configurações duplicadas
    'config/google-cloud-config.js',       // Integrado em coffee-shop-app.js
    'config/student-config.js',            // Integrado em coffee-shop-app.js
    'config/google-apis-config.js',        // Duplicado
    'config/student-setup.js',             // Não usado
    
    // READMEs duplicados
    'GOOGLE_APIS_SETUP.md',               // Duplicado
    'GOOGLE-SETUP.md',                    // Substituído por README-ORGANIZED.md
    'README-STUDENT.md'                   // Substituído por README-ORGANIZED.md
];

// Arquivos essenciais que devem ser mantidos
const essentialFiles = [
    // HTML
    'index.html',                         // Original (backup)
    'index-clean.html',                   // Versão limpa (usar esta)
    
    // JavaScript essenciais
    'assets/js/coffee-shop-app.js',       // Sistema completo
    'assets/js/jquery.min.js',            // jQuery
    'assets/js/bootstrap.min.js',         // Bootstrap
    'assets/js/custom-scripts.js',        // Scripts originais
    'assets/js/smoothscroll.js',          // Scroll suave
    'assets/js/jquery.easing.1.3.js',     // Animações
    'assets/js/modernizr.custom.js',      // Modernizr
    
    // Sistemas importantes
    'assets/js/security-manager.js',      // Segurança (pode manter como backup)
    'assets/js/auth-system.js',           // Auth (pode manter como backup)
    'assets/js/language-manager.js',      // Idiomas (se usar)
    'assets/js/menu-system.js',           // Menu (se usar)
    'assets/js/events-system.js',         // Eventos (se usar)
    
    // Configuração
    'config/config.js',                   // Configuração original
    
    // CSS (todos essenciais)
    'assets/css/',                        // Toda pasta CSS
    
    // Imagens (todas essenciais)
    'assets/img/',                        // Toda pasta de imagens
    
    // Idiomas (se usar)
    'languages/',                         // Pasta de idiomas
    
    // Documentação
    'README.md',                          // README original
    'README-ORGANIZED.md',                // Nova documentação
    'SECURITY.md',                        // Documentação de segurança
    
    // Outros
    '.env.example',                       // Exemplo de configuração
    '.gitignore'                          // Git ignore
];

console.log('🧹 Script de Limpeza do Coffee Shop');
console.log('=====================================');

console.log('\n📋 Arquivos que podem ser removidos:');
filesToRemove.forEach(file => {
    console.log(`❌ ${file}`);
});

console.log('\n✅ Arquivos essenciais (manter):');
essentialFiles.forEach(file => {
    console.log(`✅ ${file}`);
});

console.log('\n📝 Instruções:');
console.log('1. Faça backup do projeto antes de remover arquivos');
console.log('2. Use index-clean.html como página principal');
console.log('3. Configure Google Cloud em coffee-shop-app.js');
console.log('4. Teste com testCoffeeShop() no console');

console.log('\n🎯 Resultado final:');
console.log('- Projeto mais limpo e organizado');
console.log('- Menos arquivos para manter');
console.log('- Mais fácil de entender');
console.log('- Melhor performance');

// Função para estudantes executarem a limpeza
window.cleanupProject = function() {
    console.log('🧹 Iniciando limpeza automática...');
    console.log('⚠️ Esta função é apenas informativa.');
    console.log('📁 Remova manualmente os arquivos listados acima.');
    console.log('✅ Ou use o comando do sistema operacional para mover para lixeira.');
};

console.log('\n💡 Para executar limpeza: cleanupProject()');