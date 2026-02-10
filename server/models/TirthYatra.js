const mongoose = require('mongoose');

const tirthYatraSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String,
        default: '🛕' // Default icon if none provided
    },
    image: {
        type: String,
        required: true
    },
    date: {
        type: String, // "24th – 31st Oct 2025" or similar display string
        required: true
    },
    startDate: {
        type: Date,
        // Optional: specific date for sorting/logic
    },
    endDate: {
        type: Date,
        // Optional
    },
    duration: {
        type: String // e.g., "7 Days / 6 Nights"
    },
    travelMode: {
        type: String,
        default: 'Train'
    },
    locations: {
        type: String, // "Barsana, Nandgaon..."
        required: true
    },
    eligibility: {
        type: String,
        default: 'Open for all seekers'
    },
    description: {
        type: String
    },
    ticketPrice: {
        type: String // We can store as string to handle ranges or "Starts from..."
    },
    advancePaymentPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    trainInfo: [{
        trainName: String,
        trainNumber: String,
        from: String,
        to: String,
        classes: [{
            category: { type: String, enum: ['AC', 'Non-AC', 'Sleeper', 'Seater', 'Other', '2AC', '3AC', '1 AC', '2 AC', '3 AC', 'CC', 'EC', 'SL', '2S', 'General'] },
            price: Number
        }],
        routes: [{
            from: String,
            to: String,
            classes: [{
                category: { type: String, enum: ['AC', 'Non-AC', 'Sleeper', 'Seater', 'Other', '2AC', '3AC', '1 AC', '2 AC', '3 AC', 'CC', 'EC', 'SL', '2S', 'General'] },
                price: Number
            }]
        }]
    }],
    itinerary: [{
        day: Number,
        date: String,
        schedule: [{
            time: String,
            activity: String,
            description: String,
            icon: String
        }],
        meals: {
            breakfast: String,
            lunch: String,
            dinner: String
        }
    }],
    packages: [{
        name: String, // e.g., "Mayapur Stay", "Puri Stay"
        description: String,
        pricing: [{
            type: { type: String }, // e.g., "Double Sharing", "Triple Sharing"
            cost: Number,
            perPerson: Number
        }]
    }],
    customPackages: [{
        name: String,
        description: String,
        price: Number
    }],
    instructions: [String], // Important guidelines
    includes: [String], // What's included
    excludes: [String], // What's excluded
    // Deprecated fields, keeping for safety but not using
    // trainDetails: String,
    // trainCategory: String,
    whatsappLink: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TirthYatra', tirthYatraSchema);
