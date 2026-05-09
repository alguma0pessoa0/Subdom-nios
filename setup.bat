@echo off
REM SubRecon Pro Setup Script for Windows

echo 🚀 SubRecon Pro - Setup Script
echo ================================

REM Verifica Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não está instalado
    echo 📥 Por favor, instale Node.js 18+ em https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do (
    echo ✓ Node.js %%i detectado
)

REM Verifica npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm não está instalado
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do (
    echo ✓ npm %%i detectado
)

REM Setup Backend
echo.
echo 📦 Configurando Backend...
cd server

if not exist "node_modules" (
    call npm install
) else (
    echo ✓ node_modules já existe
)

if not exist ".env" (
    echo 📝 Criando arquivo .env...
    copy .env.example .env
    echo ⚠️  Por favor, edite server\.env com suas configurações
) else (
    echo ✓ .env já existe
)

cd ..

REM Setup Frontend
echo.
echo 📦 Configurando Frontend...
cd client

if not exist "node_modules" (
    call npm install
) else (
    echo ✓ node_modules já existe
)

if not exist ".env.local" (
    echo 📝 Criando arquivo .env.local...
    echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
    echo ✓ .env.local criado
) else (
    echo ✓ .env.local já existe
)

cd ..

echo.
echo ✅ Setup concluído!
echo.
echo 📚 Próximos passos:
echo   1. Configure suas variáveis de ambiente:
echo      - server\.env (Database URL, JWT_SECRET)
echo      - client\.env.local (API URL)
echo   2. Configure o banco de dados PostgreSQL
echo   3. Execute as migrations: cd server ^&^& npm run prisma:migrate
echo   4. Inicie o servidor: npm run dev
echo.
echo 💡 Para iniciar tudo de uma vez:
echo   npm run dev
echo.
echo 🐳 Ou use Docker:
echo   docker-compose up
