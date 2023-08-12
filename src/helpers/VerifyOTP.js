const OTPModel = require("../models/OTPModel");

//Verify OTP
exports.OTPVerify = async (email, providedOtp) => {
    try {
        async (req, res) => {
            const userOtp = await OTPModel.findOne({ email, otp: providedOtp });
            const checkExpire = new Date() - userOtp.createdAt;

            const milliseconds = checkExpire;
            const second = Math.floor(milliseconds / 1000);


            if (userOtp.status === 1) {
                return res.json({ error: 'Code is Already Used' })
            }

            if (second > 300) {
                return res.json({ error: 'Code is Expire' })
            }

            await OTPModel.updateOne({ email, otp: providedOtp }, { status: 1 });

            res.status(200).json({ status: 'Success', massage: 'OTP Code Verification Success' })
        }

    } catch (error) {
        res.json({ error: 'Invalid OTP' })
    }
};