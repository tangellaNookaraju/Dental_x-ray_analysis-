const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const XRay = require('../models/XRay');
const Patient = require('../models/Patient');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   POST /api/reports
// @desc    Create new report
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { patientId, xrayId, findings, summary, recommendations, dentistNotes } = req.body;

        // Validate patient and X-ray exist
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const xray = await XRay.findById(xrayId);
        if (!xray) {
            return res.status(404).json({
                success: false,
                message: 'X-ray not found'
            });
        }

        // Create report
        const report = await Report.create({
            patientId,
            xrayId,
            findings,
            summary,
            recommendations,
            dentistNotes,
            createdBy: req.user.id
        });

        // Update X-ray with report ID
        xray.reportId = report._id;
        await xray.save();

        res.status(201).json({
            success: true,
            message: 'Report created successfully',
            report
        });
    } catch (error) {
        console.error('Create report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating report',
            error: error.message
        });
    }
});

// @route   GET /api/reports/:id
// @desc    Get single report
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id)
            .populate('patientId')
            .populate('xrayId')
            .populate('createdBy', 'name email');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        res.json({
            success: true,
            report
        });
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching report',
            error: error.message
        });
    }
});

// @route   GET /api/reports/patient/:patientId
// @desc    Get all reports for a patient
// @access  Private
router.get('/patient/:patientId', async (req, res) => {
    try {
        const reports = await Report.find({ patientId: req.params.patientId })
            .populate('xrayId')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        console.error('Get patient reports error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reports',
            error: error.message
        });
    }
});

// @route   PUT /api/reports/:id
// @desc    Update report
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        let report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        report = await Report.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            message: 'Report updated successfully',
            report
        });
    } catch (error) {
        console.error('Update report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating report',
            error: error.message
        });
    }
});

// @route   DELETE /api/reports/:id
// @desc    Delete report
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        await report.deleteOne();

        res.json({
            success: true,
            message: 'Report deleted successfully'
        });
    } catch (error) {
        console.error('Delete report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting report',
            error: error.message
        });
    }
});

module.exports = router;
