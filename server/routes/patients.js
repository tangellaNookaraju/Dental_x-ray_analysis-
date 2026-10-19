const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @route   GET /api/patients
// @desc    Get all patients
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        let query = {};

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { contact: { $regex: search, $options: 'i' } }
            ];
        }

        const patients = await Patient.find(query)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Patient.countDocuments(query);

        res.json({
            success: true,
            count: patients.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            patients
        });
    } catch (error) {
        console.error('Get patients error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patients',
            error: error.message
        });
    }
});

// @route   GET /api/patients/:id
// @desc    Get single patient
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.json({
            success: true,
            patient
        });
    } catch (error) {
        console.error('Get patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patient',
            error: error.message
        });
    }
});

// @route   POST /api/patients
// @desc    Create new patient
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { name, age, gender, contact, email, address, medicalHistory, allergies } = req.body;

        // Validation
        if (!name || !age || !gender || !contact) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const patient = await Patient.create({
            name,
            age,
            gender,
            contact,
            email,
            address,
            medicalHistory,
            allergies,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Patient created successfully',
            patient
        });
    } catch (error) {
        console.error('Create patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating patient',
            error: error.message
        });
    }
});

// @route   PUT /api/patients/:id
// @desc    Update patient
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        let patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            message: 'Patient updated successfully',
            patient
        });
    } catch (error) {
        console.error('Update patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating patient',
            error: error.message
        });
    }
});

// @route   DELETE /api/patients/:id
// @desc    Delete patient
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        await patient.deleteOne();

        res.json({
            success: true,
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        console.error('Delete patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting patient',
            error: error.message
        });
    }
});

module.exports = router;
