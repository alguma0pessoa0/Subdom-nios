Crie uma aplicação web completa, estilo **SaaS profissional de Cybersecurity**, chamada:

# **SubRecon Pro – Subdomain Intelligence Platform**

A aplicação deve parecer um produto comercial real, com arquitetura escalável, autenticação, dashboard moderno e estrutura pronta para monetização.

---

# OBJETIVO

Desenvolver uma plataforma SaaS que permite usuários:

* Criar conta
* Fazer login
* Escanear domínios
* Descobrir subdomínios
* Visualizar relatórios técnicos
* Exportar resultados
* Acompanhar histórico de scans
* Comparar Light vs Deep Scan
* Gerenciar planos (Free / Pro / Enterprise)

---

# ARQUITETURA

Separar o projeto em:

```
/client  → Frontend (Next.js ou React)
/server  → Backend (Node.js + Express ou FastAPI)
/database → Modelos e migrations
```

Usar arquitetura limpa e escalável.

---

# FRONTEND (Dashboard SaaS)

Tecnologias:

* Next.js ou React
* TailwindCSS
* Framer Motion
* Axios
* JWT Auth
* Chart.js ou Recharts

Tema:

* Dark mode profissional
* Estilo semelhante a ferramentas de pentest corporativas
* UI minimalista
* Cards com sombra suave
* Gradientes sutis
* Sidebar fixa

---

## 1. Landing Page Profissional

Seções:

* Hero section com CTA
* Features
* Pricing (Free / Pro / Enterprise)
* Como funciona
* FAQ
* Botão "Start Scanning"

---

## 2. Sistema de Autenticação

* Registro
* Login
* JWT
* Refresh Token
* Logout
* Proteção de rotas
* Middleware de autenticação

---

## 3. Dashboard Principal

Sidebar:

* Overview
* New Scan
* Scan History
* Reports
* API Access
* Billing
* Settings

---

## 4. Nova Varredura

Campo:

* Domínio
* Tipo de scan:

  * Light
  * Deep (somente Pro)

Botão:

* Start Scan

Exibir:

* Barra de progresso animada
* Status em tempo real (simulado ou WebSocket)

---

## 5. Resultado do Scan

Mostrar:

### Estatísticas

* Total de subdomínios
* Quantos ativos
* Quantos não resolveram
* Tempo de execução
* Técnicas utilizadas

### Gráficos

* Subdomínios por IP
* Subdomínios por tipo
* Ativos vs Inativos

---

## 6. Tabela Avançada

Colunas:

* Subdomain
* IP
* Status
* Response Time
* HTTP Status Code
* Technology (simulado)
* CNAME
* SSL Status

Funcionalidades:

* Paginação
* Filtro
* Ordenação
* Exportação
* Copiar
* Abrir em nova aba

---

## 7. Técnicas de Enumeração

Exibir tabela comparativa:

| Technique                | Light | Deep |
| ------------------------ | ----- | ---- |
| Passive DNS              | ✔     | ✔    |
| DNS Records              | ✔     | ✔    |
| DNS Enumeration          | ✔     | ✔    |
| Certificate Transparency | ✖     | ✔    |
| SSL Certificate Parsing  | ✖     | ✔    |
| HTML Crawling            | ✖     | ✔    |
| Search Engine Scraping   | ✖     | ✔    |
| External APIs            | ✖     | ✔    |
| Reverse DNS              | ✖     | ✔    |
| CNAME Brute              | ✖     | ✔    |
| Wordlist Bruteforce      | ✖     | ✔    |

---

# BACKEND

Tecnologia:

* Node.js + Express (preferencial)
* Prisma ou Sequelize
* PostgreSQL
* JWT
* Bcrypt
* Rate limiting
* Helmet
* CORS

---

## ENDPOINTS

### Auth

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Scan

```
POST /api/scan
GET /api/scan/:id
GET /api/scan/history
```

### Export

```
GET /api/export/:scanId?format=csv
GET /api/export/:scanId?format=pdf
GET /api/export/:scanId?format=json
```

---

## Estrutura do Retorno do Scan

```json
{
  "id": "scan_12345",
  "target": "example.com",
  "scanType": "deep",
  "totalFound": 342,
  "executionTime": "45s",
  "stats": {
    "active": 280,
    "inactive": 62
  },
  "techniques": ["Passive DNS", "CT Logs", "Bruteforce"],
  "results": [
    {
      "subdomain": "api.example.com",
      "ip": "192.168.0.1",
      "status": "active",
      "responseTime": "120ms",
      "httpCode": 200,
      "ssl": true,
      "cname": "example.azure.com",
      "technology": "nginx"
    }
  ]
}
```

---

# BANCO DE DADOS

Tabelas:

### Users

* id
* name
* email
* password
* role
* plan
* createdAt

### Scans

* id
* userId
* domain
* scanType
* totalFound
* executionTime
* createdAt

### Subdomains

* id
* scanId
* subdomain
* ip
* status
* responseTime
* httpCode
* ssl
* cname
* technology

---

# PLANOS (Preparado para Monetização)

Free:

* 5 scans por dia
* Apenas Light

Pro:

* Unlimited scans
* Deep scan
* Export
* API access

Enterprise:

* Multi-user
* Priority queue
* SLA

Implementar middleware de verificação de plano.

---

# SEGURANÇA

* Rate limiting
* Validação de domínio
* Sanitização
* Helmet
* Proteção contra brute force
* Logs de auditoria

---

# API KEY SYSTEM

Permitir que usuários Pro gerem API keys:

```
GET /api/v1/scan?domain=example.com
Header: x-api-key
```

---

# DESIGN REQUISITOS

* Dark cyber theme
* Azul elétrico + roxo
* UI moderna
* Micro animações
* UX fluida
* Loading skeletons
* Toast notifications

---

# EXTRAS

* WebSocket para status ao vivo
* Sistema de fila de scans
* Histórico com filtros
* Comparação entre dois scans
* Página de relatório detalhado exportável

---

# DIFERENCIAL

Criar a aplicação como se fosse um produto real pronto para:

* Deploy em VPS
* Docker
* Nginx
* Ambiente de produção

Adicionar:

* Dockerfile
* docker-compose.yml
* README profissional

---

# RESULTADO ESPERADO

Código completo, organizado, funcional e pronto para rodar localmente.

---