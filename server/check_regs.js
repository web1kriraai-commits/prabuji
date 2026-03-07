const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const db = mongoose.connection.db;
    const collection = db.collection('yatraregistrations');
    const docs = await collection.find({ primaryEmail: { $in: ['shradhdhavala@gmail.com', 'krunalrj@gmail.com', 'drbhumikachiragsoni21@gmail.com'] } }).toArray();
    console.log(JSON.stringify(docs.map(d => ({ email: d.primaryEmail, paymentScreenshot: d.paymentScreenshot, paymentMethod: d.paymentMethod })), null, 2));
    process.exit(0);
});
