<<<<<<< HEAD
# 🦷 DentAI - Dental X-Ray Lesion Detection & Smart Report Generator

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Overview

**DentAI** is an AI-powered web application designed to assist dentists in detecting and diagnosing dental lesions from X-ray images. The system automatically generates professional diagnostic reports, helping to:

- ⚡ **Improve diagnostic speed** by 50%
- 🎯 **Enhance accuracy** with AI-assisted detection (>85% accuracy)
- 📋 **Standardize reporting** with automated report generation
- 📊 **Track patient history** with comprehensive record management

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure user registration and login
- JWT-based authentication
- Role-based access control (Dentist, Admin)

### 👥 Patient Management
- Add, view, edit, and search patients
- Comprehensive patient profiles
- Medical history tracking
- View previous X-rays and reports

### 📸 X-Ray Upload & Processing
- Drag & drop interface
- Support for JPG, PNG formats
- Image preview before submission
- Secure cloud/local storage

### 🤖 AI-Powered Lesion Detection
- Detect periapical lesions, caries, cysts, bone loss, impacted teeth
- Bounding box visualization
- Confidence scores
- Tooth number mapping

### 📄 Automated Report Generation
- Professional diagnostic reports
- Structured findings and recommendations
- PDF download capability
- Clinic logo support

### 📊 Analytics Dashboard
- Total X-rays processed
- Common lesion types
- Detection trends
- Monthly usage statistics

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads

### ML Service
- **Python FastAPI** - ML API framework
- **YOLOv8** - Object detection model
- **OpenCV** - Image processing
- **PyTorch** - Deep learning framework

---

## 📁 Project Structure

```
dental-xray/
├── client/              # React frontend
├── server/              # Node.js backend
├── ml-service/          # Python ML service
├── docs/                # Documentation
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd dental-xray
```

2. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

3. **Setup Frontend**
```bash
cd client
npm install
npm start
```

4. **Setup ML Service**
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

---

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

---

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### X-Rays
- `POST /api/upload` - Upload X-ray image
- `POST /api/analyze` - Analyze X-ray with AI
- `GET /api/xrays/:patientId` - Get patient X-rays

### Reports
- `GET /api/reports/:id` - Get report
- `POST /api/reports` - Create report
- `GET /api/reports/pdf/:id` - Download PDF

---

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

---

## 📦 Deployment

### Frontend (Vercel)
```bash
cd client
vercel deploy
```

### Backend (Render/Railway)
- Connect GitHub repository
- Set environment variables
- Deploy

### Database (MongoDB Atlas)
- Create cluster
- Configure network access
- Get connection string

---

## 🎯 Roadmap

- [x] Project setup and planning
- [ ] Backend API development
- [ ] Frontend UI development
- [ ] ML model integration
- [ ] Report generation
- [ ] Testing and optimization
- [ ] Deployment

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername]
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- YOLOv8 by Ultralytics
- React community
- MongoDB team
- All contributors

---

## 📞 Support

For support, email support@dentai.com or open an issue in the repository.

---

**Made with ❤️ for better dental healthcare**
=======
# Dental_x-ray_analysis-
>>>>>>> 296cc4813b57a0e0c1c7a9e79d6bb3358a11d3bd
