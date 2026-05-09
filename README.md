# SubRecon Pro 🛡️

**Enterprise-Grade Cybersecurity SaaS Platform for Subdomain Intelligence**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791)](https://www.postgresql.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**SubRecon Pro** é uma plataforma SaaS profissional desenvolvida para especialistas em cibersegurança, pentesters e analistas de segurança da informação. Com uma arquitetura escalável e moderna, oferece ferramentas avançadas para enumeração de subdomínios com dois níveis de análise:

- **Light Scan**: Técnicas passivas rápidas para descoberta inicial
- **Deep Scan**: Análise completa com brute force, crawling e integração com APIs de terceiros

### ✨ Características Principais

- 🔍 **Enumeração de Subdomínios Avançada** - Múltiplas técnicas de detecção
- 📊 **Analytics em Tempo Real** - Gráficos e relatórios detalhados
- 🔐 **Autenticação Segura** - JWT + Bcrypt com refresh tokens
- 💳 **Sistema de Planos** - Free, Pro e Enterprise
- 🔑 **API RESTful** - Acesso programático com API Keys
- 📁 **Exportação Múltipla** - CSV, JSON, PDF
- 📈 **Histórico Completo** - Rastreamento de todos os scans
- 🚀 **Performance** - Infraestrutura otimizada e escalável

---

## 🏗️ Architecture

```
SubRecon Pro/
├── client/               # Frontend (Next.js 14)
│   ├── src/
│   │   ├── app/         # Páginas (App Router)
│   │   ├── components/  # Componentes React
│   │   ├── lib/         # Utilitários e API
│   │   └── styles/      # CSS global + Tailwind
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── server/              # Backend (Express.js)
│   ├── src/
│   │   ├── controllers/ # Lógica de negócio
│   │   ├── middleware/  # Autenticação, Rate Limiting
│   │   ├── routes/      # Rotas da API
│   │   ├── utils/       # Utilitários
│   │   └── server.js    # Entrada da aplicação
│   ├── prisma/
│   │   └── schema.prisma # ORM Schema
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml   # Orquestração de containers
├── Dockerfile           # Build de produção
└── README.md            # Documentação
```

---

## 🚀 Getting Started

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL 16+
- Docker (opcional, para containerização)
- Git

### Quick Start (Docker)

```bash
# Clone o repositório
git clone https://github.com/alguma0pessoa0/Subdom-nios.git
cd Subdom-nios

# Inicie com Docker Compose
docker-compose up

# Acesse
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
```

---

## 💻 Installation

### Instalação Local

#### 1. Backend Setup

```bash
cd server

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env

# Edit .env com suas configurações
# DATABASE_URL=postgresql://user:password@localhost:5432/subrecon_pro
# JWT_SECRET=sua-chave-secreta-aqui

# Execute migrations do Prisma
npm run prisma:migrate

# Gere cliente Prisma
npm run prisma:generate

# Inicie o servidor
npm run dev

# Em produção
npm run build
npm start
```

#### 2. Frontend Setup

```bash
cd client

# Instale dependências
npm install

# Configure variáveis de ambiente
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF

# Inicie em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

---

## ⚙️ Configuration

### Backend Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/subrecon_pro"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Features
MAX_CONCURRENT_SCANS=5
BRUTE_FORCE_WORDLIST_URL="https://..."
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📡 API Reference

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha_segura_123"
}

Response: 201 Created
{
  "user": { "id", "email", "name", "plan" },
  "token": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha_segura_123"
}

Response: 200 OK
{
  "user": { "id", "email", "name", "plan" },
  "token": "jwt_token"
}
```

#### Get Profile
```http
GET /api/auth/me
Authorization: Bearer {token}

Response: 200 OK
{
  "user": { "id", "email", "name", "plan", "role", "createdAt" }
}
```

### Scans

#### Create Scan
```http
POST /api/scan
Authorization: Bearer {token}
Content-Type: application/json

{
  "domain": "example.com",
  "scanType": "LIGHT"  // or "DEEP" (requires Pro plan)
}

Response: 201 Created
{
  "scan": {
    "id": "scan_123",
    "domain": "example.com",
    "scanType": "LIGHT",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Scan Details
```http
GET /api/scan/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "scan": {
    "id": "scan_123",
    "domain": "example.com",
    "scanType": "LIGHT",
    "status": "COMPLETED",
    "totalFound": 42,
    "executionTime": 5234,
    "techniques": ["Passive DNS", "DNS Records"],
    "subdomains": [
      {
        "subdomain": "www.example.com",
        "ip": "192.168.1.1",
        "status": "active",
        "httpCode": 200,
        "ssl": true
      }
    ],
    "stats": {
      "active": 38,
      "inactive": 4,
      "totalWithSSL": 36
    }
  }
}
```

#### Get Scan History
```http
GET /api/scan?limit=10&offset=0
Authorization: Bearer {token}

Response: 200 OK
{
  "scans": [...],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 0
  }
}
```

#### Export Scan
```http
GET /api/scan/:id/export?format=csv
Authorization: Bearer {token}

Response: 200 OK (CSV file)
```

### API Keys

#### Generate API Key
```http
POST /api/api-keys
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Application"
}

Response: 201 Created
{
  "apiKey": {
    "id": "key_123",
    "key": "sk_xyz789...",
    "name": "My Application",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get API Keys
```http
GET /api/api-keys
Authorization: Bearer {token}

Response: 200 OK
{
  "apiKeys": [...]
}
```

---

## 🌐 API Usage with API Key

```bash
# Create scan
curl -X POST http://localhost:5000/api/scan \
  -H "x-api-key: sk_xyz789..." \
  -H "Content-Type: application/json" \
  -d '{"domain":"example.com","scanType":"LIGHT"}'

# Get scan
curl http://localhost:5000/api/scan/scan_123 \
  -H "x-api-key: sk_xyz789..."
```

---

## 💳 Pricing Plans

| Feature | Free | Pro | Enterprise |
|---------|------|-----|-----------|
| Scans por dia | 5 | Unlimited | Unlimited |
| Light Scan | ✓ | ✓ | ✓ |
| Deep Scan | ✗ | ✓ | ✓ |
| Exportação | ✗ | ✓ | ✓ |
| API Access | ✗ | ✓ | ✓ |
| Multi-user | ✗ | ✗ | ✓ |
| Support | Email | 24/7 | Dedicated |
| Price | Free | $29/mo | Custom |

---

## 🚀 Deployment

### Heroku

```bash
# Instale Heroku CLI
heroku login

# Crie a aplicação
heroku create subrecon-pro

# Configure variáveis
heroku config:set DATABASE_URL=your_database_url
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### DigitalOcean / VPS

```bash
# SSH no servidor
ssh root@your_server_ip

# Clone e configure
git clone repo_url
cd Subdom-nios

# Docker Compose
docker-compose -f docker-compose.yml up -d

# Nginx/Caddy como reverse proxy
# Configure certificados SSL
```

### Kubernetes

```bash
# Deploy com kubectl
kubectl apply -f k8s/
```

---

## 🔐 Security

### Boas Práticas Implementadas

✅ **Autenticação**
- JWT com expiração configurável
- Refresh tokens de longa duração
- Bcrypt para hash de senhas

✅ **Rate Limiting**
- Proteção contra brute force
- Limites por usuário
- Throttling de API

✅ **Validação**
- Sanitização de entrada
- Validação de domínios
- CORS configurável

✅ **Infraestrutura**
- Helmet para headers HTTP seguros
- HTTPS/TLS obrigatório em produção
- Variáveis de ambiente sensíveis
- Logs de auditoria

✅ **Dados**
- Encriptação de senhas
- API keys rotacionáveis
- Isolamento por usuário

---

## 📝 Database Schema

### Users
- id (UUID)
- email (Unique)
- name
- password (Bcrypt)
- plan (FREE, PRO, ENTERPRISE)
- role (USER, ADMIN)
- createdAt

### Scans
- id (UUID)
- userId (FK)
- domain
- scanType (LIGHT, DEEP)
- status (PENDING, RUNNING, COMPLETED, FAILED)
- totalFound
- executionTime (ms)
- techniques (Array)
- createdAt

### Subdomains
- id (UUID)
- scanId (FK)
- subdomain
- ip
- status (active, inactive)
- httpCode
- ssl (Boolean)
- cname
- technology
- responseTime (ms)

### API Keys
- id (UUID)
- userId (FK)
- key (Unique)
- name
- active (Boolean)
- lastUsedAt

---

## 🧪 Testing

```bash
# Backend tests (quando implementado)
cd server
npm test

# Frontend tests
cd client
npm test

# E2E tests
npm run test:e2e
```

---

## 📚 Frontend Features

### Pages
- ✓ Landing Page (Public)
- ✓ Login / Register
- ✓ Dashboard (Overview)
- ✓ Nova Varredura
- ✓ Histórico de Scans
- ✓ Detalhes do Scan com gráficos (Recharts)
- ✓ API Keys Management
- ✓ Settings

### Components
- ✓ Button (variantes: primary, secondary, ghost, danger)
- ✓ Input com validação
- ✓ Card estilizado
- ✓ Alert (info, success, warning, error)
- ✓ LoadingSpinner com animação
- ✓ ProgressBar animada
- ✓ Sidebar navegação fixa

### Styling
- ✓ Tailwind CSS com tema dark
- ✓ Gradientes azul + roxo
- ✓ Animações com Framer Motion
- ✓ Responsivo (mobile-first)
- ✓ Micro-interações

---

## 🔧 Backend Features

### Controllers
- ✓ Auth (register, login, profile, refresh)
- ✓ Scan (create, get, history, export)
- ✓ API Key (generate, list, revoke)

### Middleware
- ✓ JWT authentication
- ✓ API Key authentication
- ✓ Rate limiting
- ✓ Error handling
- ✓ CORS

### Scanning Techniques
- ✓ Passive DNS
- ✓ DNS Records Resolution
- ✓ DNS Enumeration
- ✓ Certificate Transparency (Deep)
- ✓ SSL Certificate Parsing (Deep)
- ✓ HTML Crawling (Deep)
- ✓ Wordlist Bruteforce (Deep)

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Next.js 14** - Framework com App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animações
- **Recharts** - Gráficos
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **Node.js 20** - Runtime
- **Express.js** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Autenticação
- **Bcryptjs** - Hash de senhas
- **Helmet** - HTTP headers
- **CORS** - Cross-origin

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração local
- **PostgreSQL** - Banco de dados
- **Git** - Versionamento

---

## 📊 Project Statistics

- **Frontend**: ~2500 linhas de código (React/Next.js)
- **Backend**: ~1500 linhas de código (Express.js)
- **Database Schema**: 5 tabelas principais
- **API Endpoints**: 13 rotas implementadas
- **Components**: 8+ componentes reutilizáveis
- **Dark Theme**: 100% cybersecurity aesthetic

---

## 🤝 Contributing

Contribuições são bem-vindas! Por favor:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 License

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

---

## 👥 Autor

**SubRecon Pro Team**
- GitHub: [@alguma0pessoa0](https://github.com/alguma0pessoa0)

---

## 📞 Support

Para suporte e dúvidas:
- 📧 Email: support@subrecon.pro
- 🐛 Issues: [GitHub Issues](https://github.com/alguma0pessoa0/Subdom-nios/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/alguma0pessoa0/Subdom-nios/discussions)

---

## 🎉 Acknowledgments

- Comunidade open-source de cybersecurity
- Ferramentas inspiradoras como Amass, Subfinder, Assetfinder
- Comunidade Next.js e React

---

**Status do Projeto**: 🚀 Pronto para Produção

Desenvolvido com ❤️ para profissionais de segurança.
