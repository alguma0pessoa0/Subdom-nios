#!/bin/bash

# SubRecon Pro Setup Script
# Este script configura a aplicação localmente

set -e

echo "🚀 SubRecon Pro - Setup Script"
echo "================================"

# Verifica Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado"
    echo "📥 Por favor, instale Node.js 18+ em https://nodejs.org"
    exit 1
fi

echo "✓ Node.js $(node -v) detectado"

# Verifica npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado"
    exit 1
fi

echo "✓ npm $(npm -v) detectado"

# Setup Backend
echo ""
echo "📦 Configurando Backend..."
cd server

if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✓ node_modules já existe"
fi

# Cria arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "⚠️  Por favor, edite server/.env com suas configurações"
else
    echo "✓ .env já existe"
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Configurando Frontend..."
cd client

if [ ! -d "node_modules" ]; then
    npm install
else
    echo "✓ node_modules já existe"
fi

# Cria arquivo .env.local se não existir
if [ ! -f ".env.local" ]; then
    echo "📝 Criando arquivo .env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
    echo "✓ .env.local criado"
else
    echo "✓ .env.local já existe"
fi

cd ..

echo ""
echo "✅ Setup concluído!"
echo ""
echo "📚 Próximos passos:"
echo "  1. Configure suas variáveis de ambiente:"
echo "     - server/.env (Database URL, JWT_SECRET)"
echo "     - client/.env.local (API URL)"
echo "  2. Configure o banco de dados PostgreSQL"
echo "  3. Execute as migrations: cd server && npm run prisma:migrate"
echo "  4. Inicie o servidor: npm run dev"
echo ""
echo "💡 Para iniciar tudo de uma vez:"
echo "  npm run dev"
echo ""
echo "🐳 Ou use Docker:"
echo "  docker-compose up"
