const mongoose = require('mongoose');

//Database Connect
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('Database has been Connected!😊')
    } catch (error) {
        console.log('Database has been not Connected!😒', error)
    }
}
module.exports = connectDB;