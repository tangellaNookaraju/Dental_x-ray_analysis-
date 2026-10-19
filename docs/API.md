# DentAI API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "Dr. John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "dentist"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "role": "dentist"
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "role": "dentist"
  }
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Dr. John Doe",
    "email": "john@example.com",
    "role": "dentist"
  }
}
```

---

## Patient Endpoints

### Get All Patients
**GET** `/patients?search=&page=1&limit=10`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "totalPages": 5,
  "currentPage": 1,
  "patients": [...]
}
```

### Get Single Patient
**GET** `/patients/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "patient": {
    "id": "patient_id",
    "name": "Jane Smith",
    "age": 35,
    "gender": "Female",
    "contact": "1234567890",
    "email": "jane@example.com",
    "medicalHistory": "...",
    "createdBy": {...}
  }
}
```

### Create Patient
**POST** `/patients`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Jane Smith",
  "age": 35,
  "gender": "Female",
  "contact": "1234567890",
  "email": "jane@example.com",
  "address": "123 Main St",
  "medicalHistory": "No known allergies",
  "allergies": "None"
}
```

### Update Patient
**PUT** `/patients/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:** (any patient fields to update)

### Delete Patient
**DELETE** `/patients/:id`

**Headers:** `Authorization: Bearer <token>`

---

## X-Ray Endpoints

### Upload X-Ray
**POST** `/xrays/upload`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `xray`: Image file (JPG/PNG)
- `patientId`: Patient ID
- `imageType`: OPG | Bitewing | Periapical | Other

**Response:**
```json
{
  "success": true,
  "message": "X-ray uploaded successfully",
  "xray": {
    "id": "xray_id",
    "imageUrl": "/uploads/xrays/filename.jpg",
    "patientId": "patient_id",
    "imageType": "OPG",
    "processed": false
  }
}
```

### Analyze X-Ray
**POST** `/xrays/analyze/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "X-ray analyzed successfully",
  "predictions": {
    "detections": [
      {
        "lesionType": "Periapical Lesion",
        "toothNumber": "36",
        "confidence": 87.5,
        "boundingBox": { "x": 120, "y": 150, "width": 80, "height": 90 },
        "severity": "Moderate"
      }
    ]
  }
}
```

### Get Patient X-Rays
**GET** `/xrays/patient/:patientId`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "xrays": [...]
}
```

### Get Single X-Ray
**GET** `/xrays/:id`

**Headers:** `Authorization: Bearer <token>`

### Delete X-Ray
**DELETE** `/xrays/:id`

**Headers:** `Authorization: Bearer <token>`

---

## Report Endpoints

### Create Report
**POST** `/reports`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "patientId": "patient_id",
  "xrayId": "xray_id",
  "findings": [
    {
      "lesionType": "Periapical Lesion",
      "toothNumber": "36",
      "confidence": 87.5,
      "boundingBox": { "x": 120, "y": 150, "width": 80, "height": 90 },
      "severity": "Moderate",
      "description": "Radiolucent lesion at apex"
    }
  ],
  "summary": "Multiple lesions detected",
  "recommendations": "Endodontic treatment recommended",
  "dentistNotes": "Patient to return in 2 weeks"
}
```

### Get Report
**GET** `/reports/:id`

**Headers:** `Authorization: Bearer <token>`

### Get Patient Reports
**GET** `/reports/patient/:patientId`

**Headers:** `Authorization: Bearer <token>`

### Update Report
**PUT** `/reports/:id`

**Headers:** `Authorization: Bearer <token>`

### Delete Report
**DELETE** `/reports/:id`

**Headers:** `Authorization: Bearer <token>`

---

## Dashboard Endpoints

### Get Dashboard Statistics
**GET** `/dashboard/stats`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalPatients": 150,
    "totalXrays": 320,
    "totalReports": 280,
    "processedXrays": 280,
    "processingRate": "87.50"
  },
  "recentActivity": {
    "patients": [...],
    "xrays": [...]
  },
  "analytics": {
    "lesionDistribution": [...],
    "monthlyUploads": [...]
  }
}
```

### Get Detection Trends
**GET** `/dashboard/trends?period=30`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "period": "30 days",
  "trends": {
    "totalDetections": 145,
    "averageConfidence": "85.32",
    "severityDistribution": {
      "Mild": 50,
      "Moderate": 70,
      "Severe": 25
    },
    "ageGroups": {...},
    "genderDistribution": {...}
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (development only)"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
