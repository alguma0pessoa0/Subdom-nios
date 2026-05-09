# SubRecon Pro - Quick Start Guide 🚀

## Installation & Setup

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/alguma0pessoa0/Subdom-nios.git
cd Subdom-nios

# Start all services
docker-compose up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Option 2: Local Development

#### Prerequisites
- Node.js 18+
- PostgreSQL 16+
- npm or yarn

#### Setup

1. **Run setup script**
   ```bash
   # Linux/Mac
   chmod +x setup.sh
   ./setup.sh
   
   # Windows
   setup.bat
   ```

2. **Configure Environment**
   - Edit `server/.env` with your database credentials
   - Edit `client/.env.local` (usually pre-filled)

3. **Start Services**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run prisma:migrate
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

---

## Demo Credentials

```
Email: demo@subrecon.com
Password: password123
Plan: Free (5 scans/day)
```

---

## Key Features

✅ **Subdomain Enumeration**
- Light Scan: Fast passive techniques
- Deep Scan: Comprehensive analysis with brute force

✅ **Automation**
- Queue-based scan system
- Real-time status updates

✅ **Analytics**
- Beautiful charts and statistics
- Detailed reports per scan

✅ **API Access**
- RESTful API with API keys
- Programmatic access for automation

✅ **Security**
- JWT authentication
- Rate limiting
- Bcrypt password hashing

---

## Project Structure

```
Subdom-nios/
├── client/          # Next.js 14 Frontend
├── server/          # Express.js Backend
├── docker-compose.yml
├── Dockerfile
├── README.md
├── DEVELOPMENT.md
└── setup.{sh,bat}
```

---

## Quick Commands

### Backend
```bash
cd server

npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma UI
```

### Frontend
```bash
cd client

npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Check code style
```

---

## Database Setup

### With Docker Compose
Database is automatically set up with:
- User: `subrecon`
- Password: `subrecon_password_123`
- Database: `subrecon_pro`

### Manual PostgreSQL

```bash
# Create database
createdb subrecon_pro

# Configure .env
DATABASE_URL="postgresql://user:password@localhost:5432/subrecon_pro"

# Run migrations
npm run prisma:migrate
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile

### Scans
- `POST /api/scan` - Create scan
- `GET /api/scan/:id` - Get scan details
- `GET /api/scan` - List scans
- `GET /api/scan/:id/export` - Export results

### API Keys
- `POST /api/api-keys` - Generate API key
- `GET /api/api-keys` - List keys
- `DELETE /api/api-keys/:id` - Revoke key

---

## Configuration

### Frontend Environment
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend Environment (see `.env.example`)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for tokens
- `CORS_ORIGIN` - Allowed CORS origins
- `PORT` - Server port (default: 5000)

---

## Troubleshooting

### Port 3000/5000 already in use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or change port
npm run dev -- -p 3001
```

### Database connection failed
```bash
# Check PostgreSQL is running
psql -h localhost -U postgres

# Reset database
dropdb subrecon_pro
createdb subrecon_pro
npm run prisma:migrate
```

### CORS errors
- Check `CORS_ORIGIN` in `server/.env`
- Ensure it matches your frontend URL

---

## Testing the API

### Using cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Create Scan
curl -X POST http://localhost:5000/api/scan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"domain":"example.com","scanType":"LIGHT"}'
```

### Using Postman/Insomnia
1. Import the API collection
2. Set `{{API_URL}}` to `http://localhost:5000/api`
3. Use authorization tokens from login response

---

## Deployment

### Docker Production Build
```bash
docker build -t subrecon-pro .
docker run -p 5000:5000 -p 3000:3000 subrecon-pro
```

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://prod_user:strong_password@prod_db:5432/db
JWT_SECRET=very_long_random_string_here
CORS_ORIGIN=https://yourdomain.com
```

---

## Support & Documentation

- 📖 Full Documentation: [README.md](README.md)
- 🛠️ Development Guide: [DEVELOPMENT.md](DEVELOPMENT.md)
- 🤝 Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
- 🐛 Issues: [GitHub Issues](https://github.com/alguma0pessoa0/Subdom-nios/issues)

---

## Next Steps

1. ✅ Clone and setup the project
2. 📚 Read [DEVELOPMENT.md](DEVELOPMENT.md) for deeper setup
3. 🔐 Change JWT_SECRET in production
4. 📊 Create your first scan
5. 🚀 Deploy to production

---

**Happy Scanning! 🎯**
