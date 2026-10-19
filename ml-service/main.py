from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import cv2
import numpy as np
from PIL import Image
import io
from typing import List, Dict

app = FastAPI(title="DentAI ML Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Detection(BaseModel):
    lesionType: str
    toothNumber: str
    confidence: float
    boundingBox: Dict[str, float]
    severity: str

class PredictionResponse(BaseModel):
    detections: List[Detection]
    processingTime: float

class ImagePath(BaseModel):
    image_path: str

# Global variable for model (will be loaded on startup)
model = None

@app.on_event("startup")
async def load_model():
    """Load the YOLO model on startup"""
    global model
    try:
        # TODO: Load your trained YOLOv8 model here
        # from ultralytics import YOLO
        # model = YOLO('path/to/your/model.pt')
        print("ML Service started successfully")
        print("Model loading is disabled (placeholder mode)")
    except Exception as e:
        print(f"Error loading model: {e}")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "OK",
        "service": "DentAI ML Service",
        "version": "1.0.0",
        "model_loaded": model is not None
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """
    Predict lesions from uploaded X-ray image
    """
    try:
        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # TODO: Run actual model inference
        # results = model(img)
        # detections = process_results(results)
        
        # For now, return mock data
        import time
        start_time = time.time()
        
        # Mock detections
        detections = [
            Detection(
                lesionType="Periapical Lesion",
                toothNumber="36",
                confidence=87.5,
                boundingBox={"x": 120, "y": 150, "width": 80, "height": 90},
                severity="Moderate"
            ),
            Detection(
                lesionType="Caries",
                toothNumber="46",
                confidence=92.3,
                boundingBox={"x": 300, "y": 160, "width": 60, "height": 70},
                severity="Mild"
            ),
            Detection(
                lesionType="Bone Loss",
                toothNumber="16",
                confidence=78.9,
                boundingBox={"x": 450, "y": 140, "width": 70, "height": 85},
                severity="Severe"
            )
        ]
        
        processing_time = time.time() - start_time
        
        return PredictionResponse(
            detections=detections,
            processingTime=round(processing_time, 3)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict-from-path")
async def predict_from_path(data: ImagePath):
    """
    Predict lesions from image path (for internal use)
    """
    try:
        # TODO: Implement path-based prediction
        # This would be used when the backend sends the file path
        
        return {
            "message": "Path-based prediction not yet implemented",
            "path": data.image_path
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/model-info")
async def model_info():
    """Get information about the loaded model"""
    return {
        "model_loaded": model is not None,
        "model_type": "YOLOv8 (placeholder)",
        "supported_detections": [
            "Periapical Lesion",
            "Caries",
            "Cysts",
            "Bone Loss",
            "Impacted Teeth"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
