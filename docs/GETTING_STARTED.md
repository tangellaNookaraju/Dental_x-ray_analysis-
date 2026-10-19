# 🚀 Getting Started with DentAI

This guide will help you set up and run the DentAI application locally.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/downloads/)
- **Git** - [Download](https://git-scm.com/downloads)

## 🛠️ Installation

### 1. Clone the Repository (if applicable)

```bash
git clone <repository-url>
cd dental-xray
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB connection string and other settings

# Start the server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies (already done if you followed setup)
npm install

# Start the React app
npm start
```

The frontend will run on `http://localhost:3000`

### 4. ML Service Setup (Optional)

```bash
# Navigate to ml-service directory (from project root)
cd ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the ML service
python main.py
```

The ML service will run on `http://localhost:8000`

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```
3. The default connection string is already set in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/dentai
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dentai?retryWrites=true&w=majority
   ```

## 🧪 Testing the Application

### 1. Create a Test Account

1. Open `http://localhost:3000`
2. Click "Get Started" or "Register"
3. Fill in the registration form:
   - Name: Dr. Test User
   - Email: test@example.com
   - Password: test123
   - Role: Dentist
4. Click "Create Account"

### 2. Explore Features

- **Dashboard**: View statistics and quick actions
- **Patients**: Add and manage patient records
- **Upload X-Ray**: Upload dental X-rays for analysis
- **Analysis**: View AI detection results

## 📁 Project Structure

```
dental-xray/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React Context (Auth)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── App.js       # Main app component
│   └── package.json
│
├── server/              # Node.js backend
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Entry point
│
├── ml-service/          # Python ML service
│   ├── main.py          # FastAPI app
│   └── requirements.txt
│
└── docs/                # Documentation
```

## 🔧 Configuration

### Backend (.env)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ML_SERVICE_URL=http://localhost:8000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for MongoDB Atlas)

### Port Already in Use

```bash
# Find and kill process on port 5000 (backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### React Build Errors

```bash
# Clear cache and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
```

### ML Service Not Running

The application will work without the ML service using mock data. To enable real AI predictions:

1. Ensure Python 3.9+ is installed
2. Install dependencies: `pip install -r requirements.txt`
3. Train or load a YOLOv8 model
4. Update `main.py` to load your model

## 📚 API Documentation

See [docs/API.md](../docs/API.md) for complete API documentation.

## 🚀 Deployment

See [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md) for deployment instructions.

## 💡 Tips

1. **Development Mode**: Use `npm run dev` for auto-reload
2. **Testing**: Create test patients and X-rays to explore features
3. **Mock Data**: The ML service returns mock detections if not configured
4. **Security**: Change JWT_SECRET in production

## 📞 Support

For issues or questions:
- Check the documentation in `/docs`
- Review the API documentation
- Check console logs for errors

## ✅ Next Steps

1. ✅ Set up backend server
2. ✅ Set up frontend
3. ✅ Configure database
4. ⏳ Set up ML service (optional)
5. ⏳ Add patient records
6. ⏳ Upload X-rays
7. ⏳ Generate reports

---

**Happy coding! 🦷✨**
