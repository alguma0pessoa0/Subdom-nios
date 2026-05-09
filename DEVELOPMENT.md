# 📚 Guia de Desenvolvimento

## Ambiente de Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm 9+
- PostgreSQL 16+
- Git

### Setup Rápido

#### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

#### Windows
```cmd
setup.bat
```

### Setup Manual

1. **Backend**
```bash
cd server
npm install
cp .env.example .env
# Edite .env com suas configurações
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

2. **Frontend**
```bash
cd client
npm install
cp .env.example .env.local
npm run dev
```

---

## Структура do Projeto

### Backend (`/server`)

```
src/
├── controllers/      # Lógica de negócio
│   ├── authController.js
│   ├── scanController.js
│   └── apiKeyController.js
│
├── middleware/       # Middlewares Express
│   ├── auth.js
│   ├── rateLimiter.js
│   └── errorHandler.js
│
├── routes/          # Definição de rotas
│   ├── authRoutes.js
│   ├── scanRoutes.js
│   └── apiKeyRoutes.js
│
├── utils/           # Utilitários
│   └── jwt.js
│
└── server.js        # Entrada da aplicação

prisma/
└── schema.prisma    # Schema do banco de dados
```

### Frontend (`/client`)

```
src/
├── app/             # Páginas (Next.js App Router)
│   ├── page.js                    # Landing page
│   ├── login/
│   ├── register/
│   └── dashboard/
│       ├── layout.js              # Dashboard layout
│       ├── page.js                # Overview
│       ├── scan/
│       │   ├── new/page.js
│       │   └── [id]/page.js
│       ├── scans/page.js
│       ├── api-keys/page.js
│       ├── settings/page.js
│       └── reports/page.js
│
├── components/      # Componentes React
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── Alert.jsx
│   ├── Sidebar.jsx
│   ├── LoadingSpinner.jsx
│   ├── ProgressBar.jsx
│   └── Toast.jsx
│
├── lib/            # Utilitários
│   ├── api.js      # Cliente Axios + endpoints
│   ├── store.js    # Zustand stores
│   └── utils.js    # Funções utilitárias
│
└── styles/
    └── globals.css  # CSS global + Tailwind
```

---

## 🛠️ Development Workflow

### Iniciando Servidor de Desenvolvimento

#### Terminal 1 - Backend
```bash
cd server
npm run dev
# Servidor roda em http://localhost:5000
```

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
# Frontend roda em http://localhost:3000
```

### Banco de Dados

#### Criar migrations
```bash
cd server
npm run prisma:migrate
```

#### Atualizar schema
1. Edite `prisma/schema.prisma`
2. Execute: `npm run prisma:migrate`
3. O Prisma gerará tipos automaticamente

#### Acessar Prisma Studio (GUI)
```bash
npm run prisma:studio
```

---

## 📝 Padrões de Código

### JavaScript/Node.js

**Nomenclatura de funções**
```javascript
// Controllers
export async function createScan(req, res) { }
export async function getScan(req, res) { }

// Utilities
function generateToken() { }
function validateEmail() { }

// Middleware
export function authMiddleware(req, res, next) { }
```

**Tratamento de erros**
```javascript
try {
  const data = await fetchData();
  res.json({ success: true, data });
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Server error' });
}
```

### React/Next.js

**Componentes**
```javascript
'use client'; // Se usar client-side features

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // effect
  }, [dependency]);
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

**Imports**
```javascript
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/Button';
import { api } from '@/lib/api';
```

---

## 🔍 Debugging

### Backend

**Habilitar logs detalhados**
```javascript
console.log('Debug info:', { var1, var2 });
console.error('Error:', error);
```

**Usar Debugger**
```bash
node --inspect-brk src/server.js
# Abre chrome://inspect no Chrome
```

### Frontend

**DevTools React**
- Instale: [React Developer Tools](https://chrome.google.com/webstore)
- Inspect components no navegador

**Next.js Logs**
```bash
npm run dev -- --debug
```

---

## 🧪 Testing

### Backend (quando implementar)
```bash
cd server
npm test
```

### Frontend
```bash
cd client
npm test
```

---

## 📦 Build para Produção

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd client
npm run build
npm start
```

### Docker
```bash
docker-compose build
docker-compose up
```

---

## 🚀 Deployment

### Variáveis de Ambiente em Produção

```env
# .env (Backend)
NODE_ENV=production
DATABASE_URL=postgresql://prod_user:prod_pass@prod_db/subrecon
JWT_SECRET=production_super_secret_key
CORS_ORIGIN=https://subrecon.pro
```

### Check-list de Produção

- [ ] Variáveis de ambiente configuradas
- [ ] HTTPS/TLS ativado
- [ ] Database backups configurados
- [ ] Rate limiting ativo
- [ ] Logging e monitoramento
- [ ] Certificados SSL válidos
- [ ] Firewall configurado

---

## 🐛 Troubleshooting

### Erro de Conexão Database
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solução**: PostgreSQL não está rodando
```bash
# Mac
brew services start postgresql

# Linux
sudo service postgresql start

# Docker
docker run -d -p 5432:5432 postgres:16-alpine
```

### Porta 3000 já em uso
```bash
# Encontrar processo
lsof -i :3000

# Mudar porta
npm run dev -- -p 3001
```

### Erro de CORS
**Solução**: Verifique `CORS_ORIGIN` em `.env`
```env
CORS_ORIGIN=http://localhost:3000
```

---

## 📖 Recursos Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/pt-br/)
- [Prisma ORM](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hooks](https://react.dev/reference/react)

---

**Para dúvidas, abra uma issue em GitHub! 🙋**
