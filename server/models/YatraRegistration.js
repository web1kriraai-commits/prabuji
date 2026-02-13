const mongoose = require('mongoose');

// Schema for individual person/member
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    mobileNumber: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    aadhaarCard: {
        type: String // Cloudinary URL for uploaded file
    }
});

const yatraRegistrationSchema = new mongoose.Schema({
    yatraId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TirthYatra',
        required: true
    },
    yatraTitle: {
        type: String,
        required: true
    },
    // Primary contact
    primaryEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    primaryPhone: {
        type: String,
        required: true,
        trim: true
    },
    // All members/persons
    members: [personSchema],
    // Accommodation preferences
    sameRoomPreference: {
        type: Boolean,
        default: true
    },
    accommodationNotes: {
        type: String,
        trim: true
    },
    // Train selection
    selectedTrain: {
        trainName: String,
        trainNumber: String,
        classCategory: String,
        price: Number,
        boardingStation: String,
        alightingStation: String
    },
    selectedPackages: [{
        packageName: String,
        description: String,
        pricingType: String,
        pricePerPerson: Number,
        days: Number,
        totalCost: Number
    }],
    // Payment details
    paymentScreenshot: {
        type: String // Cloudinary URL
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'uploaded', 'verified', 'failed'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    paymentAmount: {
        type: Number,
        default: 0
    },
    paymentType: {
        type: String,
        enum: ['full', 'advance'],
        default: 'full'
    },
    // Suggestions/Feedback
    suggestions: {
        type: String,
        trim: true
    },
    // Status
    status: {
        type: String,
        enum: ['pending', 'contacted', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('YatraRegistration', yatraRegistrationSchema);