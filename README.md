# S.L.E.D.S.S - Healthy Lifestyle Assessment Platform

A comprehensive health and wellness web application for evaluating elderly users across six lifestyle domains: **S**ocialization, **L**earning, **E**xercise, **D**iet, **S**tress, and **S**leep.

## 🏗️ Architecture

- **Frontend**: React 19 (sledss2/)
- **Backend**: Express.js + Neo4j (back/)
- **AI**: Cohere API for personalized health coaching
- **Database**: Neo4j Graph Database
- **Authentication**: JWT + bcrypt

## 📋 Prerequisites

- Node.js 16+
- Neo4j Database (local or cloud instance)
- Cohere API Key

## 🚀 Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd back
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with:
   - `NEO4J_URI`: Your Neo4j connection string
   - `NEO4J_USER`: Your Neo4j username
   - `NEO4J_PASSWORD`: Your Neo4j password
   - `SECRET_KEY`: JWT secret key (generate a secure random string)
   - `COHERE_API_KEY`: Your Cohere API key
   - `PORT`: Server port (default: 5009)

5. Start the backend server:

   ```bash
   node server.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd sledss2
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file:

   ```
   REACT_APP_BACKEND_URL=http://localhost:5009
   ```

5. Start the development server:

   ```bash
   npm start
   ```

The app will be available at `http://localhost:3000`

## 🌐 Production Deployment

### Environment Variables for Production

**Frontend (.env):**

```
REACT_APP_BACKEND_URL=https://your-backend-api-url.com
```

**Backend (.env):**

```
PORT=5009
NEO4J_URI=bolt://your-neo4j-host:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_secure_password
SECRET_KEY=your_secure_secret_key
COHERE_API_KEY=your_cohere_api_key
```

### Build for Production

1. Build the frontend:

   ```bash
   cd sledss2
   npm run build
   ```

2. The build artifacts will be in `sledss2/build/`

### Deployment Checklist

- [ ] Set all environment variables on production server
- [ ] Remove hardcoded API keys (check cohere.js)
- [ ] Configure CORS to restrict origins in production
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up process manager (PM2) for backend
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Configure logging

## 🔒 Security Notes

⚠️ **IMPORTANT**: Never commit `.env` files to version control!

1. Remove hardcoded API key in `back/cohere.js` (line 11)
2. Use environment variables for all sensitive data
3. Enable CORS only for specific origins in production
4. Use HTTPS in production
5. Implement rate limiting on API endpoints

## 📁 Project Structure

```
grok/
├── back/                   # Backend (Express.js)
│   ├── server.js          # Main server file (1090 lines - needs refactoring)
│   ├── cohere.js          # Cohere AI integration
│   ├── package.json
│   └── .env.example
├── sledss2/               # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
└── .github/
    └── workflows/
        └── master.yml     # CI/CD pipeline
```

## 🧪 API Endpoints

### Authentication

- `POST /register` - User registration
- `POST /login` - User login

### Evaluations

- `POST /social` - Save loneliness assessment
- `GET /social-score/:userId` - Get loneliness score
- `POST /api/save-bmi` - Save BMI data
- `POST /api/mna-test` - Mini Nutritional Assessment
- `POST /api/sleep-scale` - PITT sleep scale
- `POST /api/exercise-scale` - Exercise activity scale
- `POST /api/learn-scale` - Learning/literacy scale

### AI Coaching

- `POST /get-advice` - Get personalized health advice
- `POST /chat` - Chat with AI coach

## 🐛 Known Issues

1. **Single Neo4j session instance** - Should create sessions per request
2. **Large monolithic server.js** - Needs to be split into routes/controllers
3. **No input validation** - Should add validation middleware
4. **No tests** - Need unit and integration tests
5. **Generic error handling** - Needs structured error responses

## 📝 TODO

- [ ] Add unit/integration tests
- [ ] Split server.js into modular routes
- [ ] Implement input validation (Joi/express-validator)
- [ ] Add API documentation (Swagger)
- [ ] Improve accessibility (WCAG 2.1 AA)
- [ ] Add error boundaries in React
- [ ] Implement centralized error handling
- [ ] Add logging (Winston/Morgan)
- [ ] Create database migration scripts
- [ ] Add performance monitoring

## 📄 License

[Your License Here]

## 👥 Contributors

[Your Name/Team]

## 🆘 Support

For issues and questions, please open a GitHub issue.
