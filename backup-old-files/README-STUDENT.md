# Coffee Shop - Projeto Estudantil 🚀

## ✅ Problemas Corrigidos

### 🔒 Segurança
- ✅ **Salt hardcoded** → Agora usa configuração
- ✅ **XSS Protection** → Validação de entrada melhorada
- ✅ **Log Injection** → Logs sanitizados
- ✅ **Tratamento de erros** → Validação de nulos/indefinidos
- ✅ **Autorização** → Verificações de segurança adicionadas

### ⚡ Performance
- ✅ **Cache de DOM** → Elementos armazenados
- ✅ **Operações JSON** → Otimizadas
- ✅ **Consultas repetidas** → Reduzidas

## 🆕 Novas Funcionalidades

### 📡 Sistema de APIs Simples
- **Menu dinâmico** - Carrega itens via API
- **Sistema de pedidos** - Simula pedidos reais
- **Formulário de contato** - Envia mensagens
- **Widget do tempo** - Mostra clima atual

### 🛠️ Para Estudantes
- **Configuração simples** - Arquivo `student-config.js`
- **Exemplos práticos** - Como usar as APIs
- **Dados mock** - Não precisa de servidor real
- **Console amigável** - Logs explicativos

## 🚀 Como Usar

### 1. Configuração Básica
```javascript
// Edite config/student-config.js
window.coffeeShopConfig = {
    businessName: 'Seu Coffee Shop',
    businessEmail: 'seu@email.com',
    salt: 'sua_chave_secreta_aqui'
};
```

### 2. Testando as APIs
```javascript
// No console do navegador:
testAllAPIs()        // Testa todas as APIs
getSystemStatus()    // Mostra status do sistema
clearTestData()      // Limpa dados de teste
```

### 3. Exemplos de Uso

#### Carregar Menu
```javascript
const menu = await apiManager.getCoffeeMenu();
console.log(menu.data); // Lista de produtos
```

#### Fazer Pedido
```javascript
const pedido = {
    items: [{ id: 1, name: 'Cappuccino', quantity: 1, price: 3.50 }],
    total: 3.50,
    customerName: 'João'
};

const result = await apiManager.submitOrder(pedido);
```

#### Enviar Contato
```javascript
const contato = {
    name: 'Maria',
    email: 'maria@email.com',
    message: 'Adorei o café!'
};

const result = await apiManager.submitContact(contato);
```

## 📁 Arquivos Importantes

### Novos Arquivos
- `config/student-config.js` - Configuração do projeto
- `assets/js/simple-api-manager.js` - Sistema de APIs
- `assets/js/api-examples.js` - Exemplos práticos

### Arquivos Corrigidos
- `assets/js/security-manager.js` - Segurança melhorada
- `assets/js/auth-system.js` - Autenticação corrigida
- `index.html` - Scripts atualizados

## 🎯 Funcionalidades Principais

### ✅ Sistema de Usuários
- Registro seguro
- Login com validação
- Perfil do usuário
- Logout seguro

### ✅ Menu Interativo
- Categorias (Cafés, Chás, Doces)
- Preços dinâmicos
- Interface responsiva

### ✅ Sistema de Pedidos
- Carrinho de compras
- Validação de dados
- Histórico de pedidos

### ✅ Formulário de Contato
- Validação completa
- Sanitização de dados
- Feedback ao usuário

## 🔧 Desenvolvimento

### Console do Navegador
Abra F12 e veja os logs:
```
🚀 Sistema de APIs carregado!
📋 Carregando menu...
✅ Menu carregado: [...]
📚 Exemplos de API carregados!
```

### Dados Locais
O projeto salva dados no localStorage:
- `coffee_orders` - Pedidos realizados
- `coffee_contacts` - Mensagens de contato
- `cs_user` - Dados do usuário logado

## 🎓 Para Estudantes

### Aprendizado
- **JavaScript moderno** - Classes, async/await, fetch
- **Segurança web** - Sanitização, validação, hashing
- **APIs REST** - Requisições HTTP, JSON
- **UX/UI** - Formulários, feedback, responsividade

### Próximos Passos
1. **Backend real** - Node.js, PHP, Python
2. **Banco de dados** - MySQL, MongoDB
3. **Autenticação JWT** - Tokens seguros
4. **Deploy** - Netlify, Vercel, Heroku

## 🆘 Ajuda

### Problemas Comuns
- **APIs não funcionam?** → Verifique o console (F12)
- **Login não salva?** → Verifique localStorage
- **Erros de segurança?** → Configure o salt em student-config.js

### Contato
- Abra uma issue no GitHub
- Consulte a documentação
- Use o console para debug

---

**Feito com ☕ para estudantes!**