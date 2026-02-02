const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TirthYatra = require('./models/TirthYatra');

dotenv.config();

const seedYatra = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const yatraData = {
            title: "Mayapur Jagannath Puri Yatra 2026 - Purushottam Maas Special",
            icon: "🕉️",
            image: "https://iskconnews.org/wp-content/uploads/2023/06/Jagannath-Puri-Rath-Yatra.jpg", // Placeholder or relevant image
            date: "17th – 27th May 2026",
            startDate: new Date("2026-05-17"),
            endDate: new Date("2026-05-27"),
            duration: "11 Days / 10 Nights",
            travelMode: "Train & AC Bus",
            locations: "Mayapur, Jagannath Puri, Ekachakra, Shantipur",
            eligibility: "Open for all seekers",
            description: "Join us on a deeply transformative yatra to the sacred dhamas of Puri and Mayapur in the supremely rare and auspicious month of Purushottam Maas 2026. Walk the sacred paths of Sri Kshetra Parikrama and Nawadwipa Mandal Parikrama.",
            ticketPrice: "Starts from ₹1000 + Train",

            includes: [
                "Purushottam Maas Special Yatra (Once in 4 Years)",
                "Sri Kshetra Parikrama in Puri covering 30+ sacred places of Lord Jagannath",
                "Nawadwipa Mandal Parikrama in Mayapur visiting 35+ holy locations",
                "Comfortable AC Luxury Buses for all yatra travel",
                "AC & Non-AC Room Options",
                "3 Times Daily Delicious Prasadam",
                "Daily Kirtan, Bhajan & Sankirtan",
                "Inspiring Hari-Katha sessions & Guided Parikrama",
                "Uplifting Devotee Association (Sadhu-Sanga)",
                "Darshan and Bath of Sacred Rivers & Holy Places",
                "Peaceful & Fully Devotional Yatra Environment"
            ],

            excludes: [
                "Any Special Personal Requirements (medicines, personal items, etc.)",
                "Personal Rickshaws / Local Auto Charges",
                "Packaged Drinking Water Bottles",
                "Laundry Charges"
            ],

            trainInfo: [
                {
                    trainName: "Okha–Shalimar Superfast Express",
                    trainNumber: "22905",
                    classes: [
                        { category: "Sleeper", price: 845 },
                        { category: "3AC", price: 2135 },
                        { category: "2AC", price: 3045 }
                    ]
                },
                {
                    trainName: "KYQ–Puri Express",
                    trainNumber: "15644",
                    classes: [
                        { category: "Sleeper", price: 365 },
                        { category: "3AC", price: 965 },
                        { category: "2AC", price: 1360 }
                    ]
                },
                {
                    trainName: "Puri–ADI Superfast Express",
                    trainNumber: "12843",
                    classes: [
                        { category: "Sleeper", price: 825 },
                        { category: "3AC", price: 2080 },
                        { category: "2AC", price: 2965 }
                    ]
                }
            ],

            packages: [
                {
                    name: "Stay at Mayapur",
                    description: "AC Room with Attached Bathroom. Food & Internal Travel: ₹4850 extra.",
                    pricing: [
                        { type: "Double Sharing (Normal)", cost: 1000, perPerson: 500 },
                        { type: "Double Sharing (Medium)", cost: 1300, perPerson: 650 },
                        { type: "Double Sharing (Deluxe)", cost: 1500, perPerson: 750 },
                        { type: "Double Sharing (Super Deluxe)", cost: 2500, perPerson: 1250 },
                        { type: "Triple Sharing (Normal, No Mattress)", cost: 1000, perPerson: 350 },
                        { type: "Triple Sharing (Medium, No Mattress)", cost: 1300, perPerson: 450 },
                        { type: "Triple Sharing (Deluxe, No Mattress)", cost: 1500, perPerson: 500 },
                        { type: "Triple Sharing (Super Deluxe, No Mattress)", cost: 2500, perPerson: 750 },
                        { type: "4 Sharing (1 Mattress)", cost: 1000, perPerson: 325 }
                    ]
                },
                {
                    name: "Rooms in Puri",
                    description: "AC Room with Attached Bathroom. Food & Internal Travel: ₹4200 extra.",
                    pricing: [
                        { type: "Double Sharing (Normal)", cost: 1300, perPerson: 650 },
                        { type: "Double Sharing (Medium)", cost: 1500, perPerson: 750 },
                        { type: "Double Sharing (Deluxe)", cost: 1700, perPerson: 750 },
                        { type: "Double Sharing (Super Deluxe)", cost: 2000, perPerson: 1250 }
                    ]
                }
            ],

            itinerary: [
                { day: 1, date: "17/05", schedule: [{ time: "19:26", activity: "Departure from BRC", description: "Train 22905" }], meals: { breakfast: "", lunch: "", dinner: "Not available" } },
                { day: 2, date: "18/05", schedule: [{ time: "05:00", activity: "Mangala Arati" }, { time: "08:00", activity: "SB Class" }], meals: { breakfast: "Nagpur 9:45 AM", lunch: "Durg/Raipur", dinner: "Jharsuguda 7:15 PM" } },
                { day: 3, date: "19/05", schedule: [{ time: "03:03", activity: "Arrival Santragachi" }, { time: "09:30", activity: "Shantipur to Mayapur" }, { time: "16:00", activity: "Parikrama: Simantadvipa / Antardvipa" }], meals: { breakfast: "Shantipur 8:15 AM", lunch: "1:00 PM", dinner: "After 8 PM" } },
                { day: 4, date: "20/05", schedule: [{ time: "06:00", activity: "Madhyadvipa Parikrama" }, { time: "Afternoon", activity: "Godruma Dwip & Ritudwip" }], meals: { breakfast: "8:30 AM", lunch: "1:00 PM", dinner: "8:30 PM" } },
                { day: 5, date: "21/05", schedule: [{ time: "06:00", activity: "Katwa Visit" }, { time: "Afternoon", activity: "Ekachakra Dham" }], meals: { breakfast: "8:00 AM", lunch: "1:00 PM (Raj Bhog)", dinner: "8:30 PM" } },
                { day: 6, date: "22/05", schedule: [{ time: "06:00", activity: "Koladvip Parikrama" }, { time: "16:00", activity: "Leave for Puri (Boat)" }, { time: "18:20", activity: "Train 15644 to Puri" }], meals: { breakfast: "8:00 AM", lunch: "1:00 PM", dinner: "8:00 PM" } },
                { day: 7, date: "23/05", schedule: [{ time: "07:45", activity: "Arrival Puri" }, { time: "10:30", activity: "Jagannath Temple Darshan" }, { time: "14:30", activity: "Rickshaw Darshan (Gambhira, Tota Gopinatha...)" }], meals: { breakfast: "Packets", lunch: "Mahaprasad 1:00 PM", dinner: "8:30 PM" } },
                { day: 8, date: "24/05", schedule: [{ time: "06:00", activity: "Departure for Konark/Bhubaneswar" }, { time: "Day", activity: "Alarnath, Chandrabhaga, Lingaraj, Sakhigopal" }], meals: { breakfast: "En-route", lunch: "En-route", dinner: "" } },
                { day: 9, date: "25/05", schedule: [{ time: "Morning", activity: "Satasana Bhajana Sthali, Samudra Snan, Svarga Dwar" }], meals: { breakfast: "8:30 AM", lunch: "2:00 PM", dinner: "8:30 PM" } },
                { day: 10, date: "26/05", schedule: [{ time: "05:00", activity: "Checkout & Nilamadhav" }, { time: "17:30", activity: "Departure (Train 12843)" }], meals: { breakfast: "ISKCON Bhubaneswar", lunch: "12:30 PM", dinner: "On Train" } },
                { day: 11, date: "27/05", schedule: [{ time: "Day", activity: "Return Journey" }, { time: "09:40", activity: "Breakfast Raipur" }, { time: "19:15", activity: "Dinner Bhusawal" }], meals: { breakfast: "Raipur", lunch: "Gondia/Nagpur", dinner: "Bhusawal" } }
            ],

            instructions: [
                "Every devotee joining the yatra must carry their original ID proof with them.",
                "All participants who are not from the assigned train, must reach the ashram on their own.",
                "Each yatri must arrive at the ashram before 11:30 AM, 19 May 2026.",
                "₹4000 must be deposited in advance (Non-refundable).",
                "Children 5+ years need full package; below 5 stay with parents.",
                "Take full responsibility for personal belongings.",
                "This yatra is for spiritual upliftment, not sightseeing.",
                "Maintain discipline and follow instructions.",
                "Strictly satvik meals (no onion, garlic, tea, coffee).",
                "Full payment 15 days before yatra to avoid cancellation."
            ]
        };

        const existingYatra = await TirthYatra.findOne({ title: yatraData.title });
        if (existingYatra) {
            console.log('Yatra already exists, updating...');
            Object.assign(existingYatra, yatraData);
            await existingYatra.save();
        } else {
            console.log('Creating new Yatra...');
            await TirthYatra.create(yatraData);
        }

        console.log('Seed completed successfully!');
        mongoose.disconnect();

    } catch (error) {
        console.error('Error seeding data:', error);
        mongoose.disconnect();
    }
};

seedYatra();
