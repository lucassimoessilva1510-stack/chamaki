# ChamaKi — Sistema de Help Desk e Gestao de Chamados de TI

Sistema completo de abertura e gestao de chamados de TI, com dois portais (Colaborador e Tecnico), banco de dados em tempo real via **Convex**, e deploy via **Netlify**.

## Equipe
- Icaro Rafael Borges (PO)
- Maria Eduarda F. da F. Silva (SM)
- Lucas Simoes Silva (Dev)
- Matheus Polini (Dev)

**Orientador:** Prof. Raulison Resende  
**Universidade Sao Judas Tadeu — 2026/2**

---

## Tecnologias
- **Frontend:** HTML + CSS + JavaScript (Vite)
- **Backend/DB:** Convex (real-time database)
- **Deploy:** Netlify

---

## Setup Local

### 1. Instalar dependencias
```bash
cd chamaki
npm install
```

### 2. Configurar o Convex
```bash
npx convex dev
```
> Na primeira vez, ele pedira para criar uma conta no Convex (gratis) e criara o projeto.
> Isso gera o arquivo `.env.local` com a URL do seu banco de dados.

### 3. Popular dados iniciais (opcional)
Em outro terminal:
```bash
npx convex run seed:seedData
```
> Isso cria 4 tecnicos, 6 colaboradores e 12 chamados de exemplo.
> Senha padrao de todos: `123456`

### 4. Rodar o frontend
```bash
npm run dev
```
> Acesse `http://localhost:5173`

---

## Contas de Teste (apos seed)

### Tecnicos (Portal do Tecnico)
| Nome | E-mail | Senha |
|------|--------|-------|
| Icaro Rafael Borges | icaro@empresa.com | 123456 |
| Lucas Simoes Silva | lucas@empresa.com | 123456 |
| Maria Eduarda F. da F. Silva | maria@empresa.com | 123456 |
| Matheus Polini | matheus@empresa.com | 123456 |

### Colaboradores (Portal do Colaborador)
| Nome | E-mail | Senha |
|------|--------|-------|
| Ana Costa | ana@gmail.com | 123456 |
| Carlos Mendes | carlos@outlook.com | 123456 |
| Fernanda Lima | fernanda@gmail.com | 123456 |
| Roberto Alves | roberto@hotmail.com | 123456 |
| Juliana Martins | juliana@gmail.com | 123456 |
| Pedro Santos | pedro@yahoo.com | 123456 |

---

## Deploy no Netlify

### 1. Subir para o GitHub
```bash
git init
git add .
git commit -m "ChamaKi v1.0"
git remote add origin https://github.com/SEU_USUARIO/chamaki.git
git push -u origin main
```

### 2. Conectar ao Netlify
1. Acesse [netlify.com](https://netlify.com) e faca login
2. Clique em **"Add new site" > "Import an existing project"**
3. Selecione seu repositorio do GitHub

### 3. Configurar variaveis de ambiente no Netlify
No painel do Netlify, va em **Site settings > Environment variables** e adicione:

| Variavel | Valor |
|----------|-------|
| `CONVEX_DEPLOY_KEY` | *(obtenha em [dashboard.convex.dev](https://dashboard.convex.dev) > Settings > Deploy Key)* |
| `VITE_CONVEX_URL` | *(a URL do seu projeto Convex, ex: `https://seu-projeto-123.convex.cloud`)* |

> A `VITE_CONVEX_URL` esta no arquivo `.env.local` gerado pelo `npx convex dev`.

### 4. Deploy
O Netlify fara o build automaticamente usando o comando do `netlify.toml`:
```
npx convex deploy --cmd 'npm run build'
```

---

## Estrutura do Projeto
```
chamaki/
├── convex/           # Backend (Convex functions)
│   ├── schema.ts     # Schema do banco de dados
│   ├── tickets.ts    # CRUD de chamados
│   ├── auth.ts       # Registro e login
│   └── seed.ts       # Dados iniciais
├── src/
│   ├── main.js       # Logica do app (Convex client)
│   └── style.css     # Estilos (navbar, cards, tabelas)
├── index.html        # Entry point
├── package.json
├── vite.config.js
└── netlify.toml      # Configuracao do Netlify
```

## Correcao de autenticacao e publicacao

O frontend usa exclusivamente o Convex. O Netlify hospeda arquivos estaticos; nao executa `server.py` nem implementa rotas `/api`. Erros de credenciais sao exibidos diretamente, sem tentar outra API.

Antes de republicar o frontend, publique as funcoes atualizadas no mesmo deployment indicado por `VITE_CONVEX_URL`. Para producao, configure `CONVEX_DEPLOY_KEY` no Netlify e use como comando de build `npx convex deploy --cmd "npm run build"`. A chave deve pertencer ao deployment correto; nao coloque chaves em variaveis `VITE_`.

Validacao local: `npm test` e `npm run build`. Dados novos de exemplo usam `123456`. Contas existentes continuam usando sua senha real, inclusive `123` se foi assim que foram criadas; nao ha mais senha universal.
