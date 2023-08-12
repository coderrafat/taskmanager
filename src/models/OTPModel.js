const { Schema, model } = require('mongoose');


const OTPSchema = new Schema({

    email: { type: String },
    otp: { type: Number },
    time: { type: Number },
    status: { type: Number, default: 0 },
    // expireAt: {
    //     type: Date,
    //     default: Date.now,
    //     index: { expires: '1m' } // Set the expiration time to 5 minutes
    // }



}, { timestamps: true, versionKey: false })

const OTPModel = model('otps', OTPSchema);

module.exports = OTPModel;