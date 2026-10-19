const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide patient name'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Please provide patient age'],
        min: 0,
        max: 150
    },
    gender: {
        type: String,
        required: [true, 'Please provide patient gender'],
        enum: ['Male', 'Female', 'Other']
    },
    contact: {
        type: String,
        required: [true, 'Please provide contact number'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    address: {
        type: String,
        trim: true
    },
    medicalHistory: {
        type: String,
        trim: true
    },
    allergies: {
        type: String,
        trim: true
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
patientSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index for faster searches
patientSchema.index({ name: 'text', contact: 'text' });

module.exports = mongoose.model('Patient', patientSchema);
