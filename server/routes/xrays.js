const express = require('express');
const router = express.Router();
const XRay = require('../models/XRay');
const Patient = require('../models/Patient');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const axios = require('axios');

// All routes are protected
router.use(protect);

// @route   POST /api/xrays/upload
// @desc    Upload X-ray image
// @access  Private
router.post('/upload', upload.single('xray'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image file'
            });
        }

        const { patientId, imageType } = req.body;

        // Validate patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Create X-ray record
        const xray = await XRay.create({
            patientId,
            imageUrl: `/uploads/xrays/${req.file.filename}`,
            imageType: imageType || 'Other',
            originalFilename: req.file.originalname,
            fileSize: req.file.size,
            uploadedBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'X-ray uploaded successfully',
            xray
        });
    } catch (error) {
        console.error('Upload X-ray error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading X-ray',
            error: error.message
        });
    }
});

// @route   POST /api/xrays/analyze/:id
// @desc    Analyze X-ray with AI
// @access  Private
router.post('/analyze/:id', async (req, res) => {
    try {
        const xray = await XRay.findById(req.params.id);

        if (!xray) {
            return res.status(404).json({
                success: false,
                message: 'X-ray not found'
            });
        }

        // Call ML service
        try {
            const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
            const response = await axios.post(`${mlServiceUrl}/predict`, {
                image_path: xray.imageUrl
            }, {
                timeout: 30000 // 30 second timeout
            });

            // Update X-ray as processed
            xray.processed = true;
            await xray.save();

            res.json({
                success: true,
                message: 'X-ray analyzed successfully',
                predictions: response.data
            });
        } catch (mlError) {
            console.error('ML Service error:', mlError.message);

            // Return mock data if ML service is not available
            res.json({
                success: true,
                message: 'X-ray analyzed (mock data - ML service unavailable)',
                predictions: {
                    detections: [
                        {
                            lesionType: 'Periapical Lesion',
                            toothNumber: '36',
                            confidence: 87.5,
                            boundingBox: { x: 120, y: 150, width: 80, height: 90 },
                            severity: 'Moderate'
                        },
                        {
                            lesionType: 'Caries',
                            toothNumber: '46',
                            confidence: 92.3,
                            boundingBox: { x: 300, y: 160, width: 60, height: 70 },
                            severity: 'Mild'
                        }
                    ]
                },
                note: 'This is mock data. Please ensure ML service is running.'
            });
        }
    } catch (error) {
        console.error('Analyze X-ray error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing X-ray',
            error: error.message
        });
    }
});

// @route   GET /api/xrays/patient/:patientId
// @desc    Get all X-rays for a patient
// @access  Private
router.get('/patient/:patientId', async (req, res) => {
    try {
        const xrays = await XRay.find({ patientId: req.params.patientId })
            .populate('uploadedBy', 'name email')
            .populate('reportId')
            .sort({ uploadDate: -1 });

        res.json({
            success: true,
            count: xrays.length,
            xrays
        });
    } catch (error) {
        console.error('Get patient X-rays error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching X-rays',
            error: error.message
        });
    }
});

// @route   GET /api/xrays/:id
// @desc    Get single X-ray
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const xray = await XRay.findById(req.params.id)
            .populate('patientId')
            .populate('uploadedBy', 'name email')
            .populate('reportId');

        if (!xray) {
            return res.status(404).json({
                success: false,
                message: 'X-ray not found'
            });
        }

        res.json({
            success: true,
            xray
        });
    } catch (error) {
        console.error('Get X-ray error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching X-ray',
            error: error.message
        });
    }
});

// @route   DELETE /api/xrays/:id
// @desc    Delete X-ray
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const xray = await XRay.findById(req.params.id);

        if (!xray) {
            return res.status(404).json({
                success: false,
                message: 'X-ray not found'
            });
        }

        // Delete file from filesystem
        const fs = require('fs');
        const filePath = `.${xray.imageUrl}`;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await xray.deleteOne();

        res.json({
            success: true,
            message: 'X-ray deleted successfully'
        });
    } catch (error) {
        console.error('Delete X-ray error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting X-ray',
            error: error.message
        });
    }
});

module.exports = router;
