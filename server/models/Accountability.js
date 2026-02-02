const mongoose = require('mongoose');

const accountabilitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    wakeupTime: {
        type: String,
        required: true
    },
    chantingRounds: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    bookReading: {
        type: Number,
        default: 0,
        min: 0,
        max: 180
    },
    deityPrayer: {
        type: String,
        enum: ['Yes', 'No', ''],
        default: ''
    },
    lectureBy: {
        type: [String],
        default: []
    },
    hearingMinutes: {
        type: Number,
        default: 0,
        min: 0,
        max: 120
    },
    bedTime: {
        type: String,
        required: true
    },
    individualVows: {
        type: String,
        default: ''
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for faster queries
accountabilitySchema.index({ userId: 1, date: -1 });
accountabilitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Accountability', accountabilitySchema);
