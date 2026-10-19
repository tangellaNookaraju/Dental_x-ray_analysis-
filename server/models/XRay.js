const mongoose = require('mongoose');

const xraySchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    imageType: {
        type: String,
        enum: ['OPG', 'Bitewing', 'Periapical', 'Other'],
        default: 'Other'
    },
    originalFilename: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    processed: {
        type: Boolean,
        default: false
    },
    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Index for faster queries
xraySchema.index({ patientId: 1, uploadDate: -1 });

module.exports = mongoose.model('XRay', xraySchema);
