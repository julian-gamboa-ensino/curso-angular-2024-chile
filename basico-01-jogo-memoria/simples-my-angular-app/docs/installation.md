# Guia de Instalação - Jogo da Memória

## Requisitos do Sistema

### Software Necessário
- Node.js (versão 18.x ou superior)
- npm (versão 9.x ou superior)
- Angular CLI (versão 17.x)
- Navegador moderno (Chrome, Firefox, Safari ou Edge)

### Hardware Recomendado
- Processador: 2 GHz ou superior
- Memória RAM: 4 GB ou superior
- Espaço em disco: 1 GB livre
- Conexão com internet para instalação

## Instalação

### 1. Preparação do Ambiente

```bash
# Verifique a versão do Node.js
node --version

# Verifique a versão do npm
npm --version

# Instale o Angular CLI globalmente
npm install -g @angular/cli
```

### 2. Clone do Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/memory-game.git

# Entre no diretório do projeto
cd memory-game
```

### 3. Instalação de Dependências

```bash
# Instale as dependências do projeto
npm install
```

### 4. Configuração do Ambiente

O projeto usa variáveis de ambiente para configuração. Crie um arquivo `.env` na raiz do projeto:

```env
# Exemplo de .env
PRODUCTION=false
DEBUG=true
```

### 5. Executando o Projeto

```bash
# Inicie o servidor de desenvolvimento
ng serve

# O jogo estará disponível em http://localhost:4200
```

## Configuração para Produção

### 1. Build do Projeto

```bash
# Gere a build de produção
ng build --configuration production
```

### 2. Arquivos Gerados
Os arquivos de produção serão gerados na pasta `dist/`:
- `index.html`: Página principal
- `main.js`: Bundle JavaScript
- `styles.css`: Estilos compilados
- `assets/`: Recursos estáticos

### 3. Deployment
O projeto pode ser hospedado em qualquer servidor web estático:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- Apache/Nginx

## Solução de Problemas

### Erros Comuns

1. **Erro de versão do Node.js**
   ```bash
   # Atualize o Node.js
   nvm install 18
   nvm use 18
   ```

2. **Erro de dependências**
   ```bash
   # Limpe o cache do npm
   npm cache clean --force
   
   # Reinstale as dependências
   rm -rf node_modules
   npm install
   ```

3. **Erro de porta em uso**
   ```bash
   # Use uma porta diferente
   ng serve --port 4201
   ```

### Verificação de Instalação

```bash
# Verifique a instalação do Angular
ng version

# Verifique as dependências
npm list
```

## Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start           # Inicia servidor de desenvolvimento
npm test           # Executa testes unitários
npm run e2e        # Executa testes end-to-end
npm run lint       # Verifica qualidade do código
npm run build      # Gera build de produção
```

### Estrutura do Projeto

```
memory-game/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   ├── assets/
│   └── environments/
├── docs/
├── e2e/
└── package.json
```

## Atualizações

### Mantendo o Projeto Atualizado

```bash
# Atualize o Angular CLI
npm update @angular/cli

# Atualize todas as dependências
npm update
```

### Versionamento

O projeto segue Semantic Versioning (SemVer):
- MAJOR: Mudanças incompatíveis
- MINOR: Novas funcionalidades
- PATCH: Correções de bugs

## Suporte

### Canais de Ajuda
- GitHub Issues
- Stack Overflow
- Angular Discord
- Documentação oficial

### Contribuição
1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença
Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes. 