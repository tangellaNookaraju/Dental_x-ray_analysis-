const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    xrayId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'XRay',
        required: true
    },
    findings: [{
        lesionType: {
            type: String,
            required: true
        },
        toothNumber: {
            type: String
        },
        confidence: {
            type: Number,
            min: 0,
            max: 100
        },
        boundingBox: {
            x: Number,
            y: Number,
            width: Number,
            height: Number
        },
        severity: {
            type: String,
            enum: ['Mild', 'Moderate', 'Severe'],
            default: 'Moderate'
        },
        description: {
            type: String
        }
    }],
    summary: {
        type: String
    },
    recommendations: {
        type: String
    },
    dentistNotes: {
        type: String
    },
    pdfUrl: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
reportSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index for faster queries
reportSchema.index({ patientId: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
