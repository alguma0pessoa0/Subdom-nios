# Guia de Segurança - SubRecon Pro

## 🔐 Visão Geral de Segurança

Este documento descreve os mecanismos de segurança implementados no SubRecon Pro e as melhores práticas para manter a aplicação segura.

---

## ✅ Implementações de Segurança

### 1. Autenticação

#### JWT (JSON Web Tokens)
- Tokens com expiração configurável (padrão: 7 dias)
- Refresh tokens de longa duração (padrão: 30 dias)
- Tokens armazenados apenas no localStorage (não recomendado para produção)

**Melhorias para Produção:**
```javascript
// Usar HttpOnly cookies
res.cookie('token', token, {
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: 'strict'
});
```

#### Senhas
- Hash com Bcrypt (10 rounds)
- Nunca armazenar senhas em plain text
- Validação mínima: 8 caracteres

```javascript
import bcrypt from 'bcryptjs';

// Hash
const hashed = await bcrypt.hash(password, 10);

// Verificar
const match = await bcrypt.compare(password, hashed);
```

---

### 2. Rate Limiting

Proteção contra ataques de brute force:

```javascript
// Autenticação: 5 tentativas por 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

// Geral: 100 requisições por 15 minutos
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Scans: Limitado pelo plano
const scanLimiter = rateLimit({
  max: (req) => req.userPlan === 'FREE' ? 5 : 999
});
```

---

### 3. Validação e Sanitização

#### Validação de Email
```javascript
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

#### Validação de Domínio
```javascript
function isValidDomain(domain) {
  const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}
```

#### Sanitização de Entrada
- Usar Prisma ORM (protection contra SQL injection)
- Validação de tipos com TypeScript/Prisma
- Escape de saídas em templates

---

### 4. CORS (Cross-Origin Resource Sharing)

```javascript
import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGIN, // Whitelist específico
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));
```

**Configuração Segura:**
```env
# .env
CORS_ORIGIN=https://subrecon.pro
```

---

### 5. HTTP Security Headers

```javascript
import helmet from 'helmet';

app.use(helmet()); // Ativa múltiplos headers de segurança

// Headers adicionados:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY
// - Strict-Transport-Security: max-age=31536000
// - Content-Security-Policy
```

---

### 6. API Keys

Segurança de API keys:

```javascript
// Gerar chave aleatória
const apiKey = crypto.randomUUID();

// Validação
const isValidApiKey = await prisma.apiKey.findUnique({
  where: { key: apiKey, active: true }
});

// Revogação
await prisma.apiKey.update({
  where: { id: keyId },
  data: { active: false }
});
```

**Boas Práticas:**
- ✓ Nunca compartilhar em repositórios públicos
- ✓ Rotacionar regularmente
- ✓ Use variáveis de ambiente
- ✓ Armazene em secret manager (AWS Secrets, HashiCorp Vault)

---

### 7. Isolamento de Dados

Cada usuário vê apenas seus próprios dados:

```javascript
const scan = await prisma.scan.findUnique({
  where: { id: scanId }
});

// Verificar ownership
if (scan.userId !== req.userId) {
  throw new Error('Unauthorized');
}
```

---

### 8. Ambiente de Desenvolvimento vs Produção

**Development:**
```env
NODE_ENV=development
JWT_SECRET=dev-key (mudar depois)
CORS_ORIGIN=http://localhost:3000
```

**Production:**
```env
NODE_ENV=production
JWT_SECRET=very-long-random-production-key
CORS_ORIGIN=https://subrecon.pro
HTTPS_ONLY=true
```

---

## 🚨 Vulnerabilidades Conhecidas e Mitigação

### 1. SQL Injection
**Status:** ✅ MITIGADO
- Usando Prisma ORM (prepared statements)
- Typecheck com TypeScript

### 2. Cross-Site Scripting (XSS)
**Status:** ✅ MITIGADO
- React sanitiza HTML automaticamente
- Next.js CSP headers
- Helmet.js ativa X-Content-Type-Options

### 3. CSRF (Cross-Site Request Forgery)
**Status:** ⚠️ PARCIAL
- Implementar CSRF tokens em formulários
- SameSite cookies

```javascript
app.use(csrf()); // Para implementar
res.locals.csrfToken = req.csrfToken();
```

### 4. Broken Authentication
**Status:** ✅ MITIGADO
- JWT com expiração
- Bcrypt para senhas
- Rate limiting em login

### 5. Sensitive Data Exposure
**Status:** ✅ MITIGADO
- HTTPS obrigatório em produção
- Senhas nunca armazenadas em texto plano
- API keys não expostas em logs

---

## 📋 Checklist de Segurança para Produção

### Antes do Deploy

- [ ] Alterar `JWT_SECRET` para string longa aleatória
- [ ] Configurar `HTTPS_ONLY=true`
- [ ] Ativar CORS apenas para domínio específico
- [ ] Configurar firewall
- [ ] SSL/TLS certificate válido
- [ ] Database backup automático
- [ ] Monitoramento de logs
- [ ] Rate limiting ativo
- [ ] Helmet.js ativo

### Infraestrutura

- [ ] Usar managed database (RDS, Azure Database)
- [ ] VPN/VPC para banco de dados
- [ ] WAF (Web Application Firewall)
- [ ] DDoS protection
- [ ] Backup e disaster recovery
- [ ] Secrets manager (AWS Secrets Manager, HashiCorp Vault)

### Monitoramento

- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic, Datadog)
- [ ] Security scanning (OWASP ZAP)
- [ ] Log aggregation (ELK, Papertrail)

---

## 🔄 Práticas Recomendadas

### 1. Rotação de Secrets
```bash
# Trocar JWT_SECRET anualmente mínimo
# Avisar usuários antes de expirar tokens
```

### 2. Versionamento de API
```http
GET /api/v1/scan
GET /api/v2/scan
```

### 3. Logging de Segurança
```javascript
app.use((req, res, next) => {
  console.log({
    timestamp: new Date(),
    method: req.method,
    path: req.path,
    userId: req.userId,
    ip: req.ip,
    status: res.statusCode
  });
  next();
});
```

### 4. Auditoria de Acesso
```javascript
// Rastrear quem acessou dados sensíveis
await prisma.auditLog.create({
  data: {
    userId: req.userId,
    action: 'VIEW_SCAN',
    resourceId: scanId,
    timestamp: new Date()
  }
});
```

---

## 🧪 Testes de Segurança

### Testes Manual
```bash
# OWASP ZAP
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:5000

# SQLMap (SQL injection testing)
sqlmap -u "http://localhost:5000/api/scan" --batch
```

### Testes Automatizados
```bash
# Snyk (vulnerability scanning)
npm install -g snyk
snyk test

# ESLint com security plugins
npm install --save-dev eslint-plugin-security
```

---

## 📞 Relatar Vulnerabilidades

Se encontrar vulnerabilidades:

1. **NÃO** publique em issues públicas
2. Email: security@subrecon.pro
3. Descreva a vulnerabilidade e passos para reproduzir
4. Aguarde resposta dentro de 48 horas

---

## 📚 Referências de Segurança

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Node.js Security Checklist](https://nodejs.org/en/knowledge/file-system/security/introduction/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html)

---

**Última Atualização:** Janeiro 2024
**Mantido por:** SubRecon Pro Security Team
