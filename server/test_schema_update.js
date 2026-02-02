const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TirthYatra = require('./models/TirthYatra');

dotenv.config();

const testSchema = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const testYatra = new TirthYatra({
            title: 'Test Yatra 2026',
            image: 'https://example.com/image.jpg',
            date: 'May 2026',
            locations: 'Puri, Mayapur',
            includes: ['Train Ticket', 'Accommodation', 'Food'],
            excludes: ['Personal Expenses', 'Shopping']
        });

        const savedYatra = await testYatra.save();
        console.log('Saved Yatra:', savedYatra);

        if (savedYatra.includes.length === 3 && savedYatra.excludes.length === 2) {
            console.log('SUCCESS: Includes and Excludes saved correctly.');
        } else {
            console.error('FAILURE: Includes or Excludes data mismatch.');
        }

        await TirthYatra.findByIdAndDelete(savedYatra._id);
        console.log('Cleaned up test data');

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        mongoose.disconnect();
    }
};

testSchema();
