const bcrypt = require('bcrypt');
const User = require("../models/UsersModel");
const jwt = require('jsonwebtoken');
const SendEmail = require('../config/SendEmail');
const OTPModel = require('../models/OTPModel');


//User Register
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, confirmPassword } = req.body;

        const name = firstName + ' ' + lastName;

        if (!firstName) {
            res.json({ massage: 'firstName is required' })
        }
        if (!lastName) {
            res.json({ massage: 'lastName is required' })
        }
        if (!username) {
            res.json({ massage: 'username is required' })
        }
        if (!email) {
            res.json({ massage: 'email is required' })
        }
        if (!password) {
            res.json({ massage: 'password is required' })
        }
        if (password.length < 6) {
            res.json({ massage: 'Password must be at least 6 characters' })
        }
        if (!confirmPassword) {
            res.json({ massage: 'confirmPassword is required' })
        }
        if (password !== confirmPassword) {
            return res.json({ massage: "Password doesn't match" })
        }

        const existingUsername = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if (existingUsername) {
            return res.json({ massage: 'Username is taken' })
        }
        if (existingEmail) {
            return res.json({ massage: 'Email is taken' })
        };

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName, lastName, username, email, password: hashedPassword
        });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);


        //Send Email

        const emailData = {
            subject: 'Email Verification',
            to: email,
            html: `<h2 style="color: 'black'">Hello ${name}!</h2> 
                    <h3>Your account has been Created!😊</h3>
                    <h5><u>Login Information</u></h5>
                    <h6>Username: <u>${username}</u></h6>
                    <h6>Password: <u>${password}</u></h6>`
        }
        SendEmail(emailData);

        res.status(201).json({
            status: 'Success',
            // massage: text,
            Data: user,
            token
        });

    } catch (error) {
        console.log(error)
    }
};

//User login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            res.json({ massage: 'Username is required' })
        }
        if (!password) {
            res.json({ massage: 'password is required' })
        }
        if (password.length < 6) {
            res.json({ massage: 'Password must be at least 6 characters' })
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ massage: 'User not found' })
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.json({ massage: 'Invalid Username or Password' })
        };

        const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);

        res.status(200).json({
            status: 'Success',
            massage: 'Login Success',
            Data: user,
            token
        })

    } catch (error) {
        console.log(error)
    }
};

//User Profile Read
exports.profile = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId, 'firstName lastName username email');

        res.status(200).json({
            status: 'Success',
            massage: 'User Profile',
            Data: user
        });

    } catch (error) {
        console.log(error)
    }
};

//Update USer Profile
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.json({ error: 'Email is taken' })
        }


        //Check Valid Email

        const user = await User.findById(req.user);
        const updateProfile = await User.findByIdAndUpdate(req.user, {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email || user.email,
        }, { new: true });

        res.json(updateProfile);

    } catch (error) {
        console.log(error)
    }
};

//Update User Password
exports.updatePassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;

        if (!password) {
            return res.json({ error: 'Password is required' })
        }
        if (!confirmPassword) {
            return res.json({ error: 'Confirm Password is required' })
        }

        if (password !== confirmPassword) {
            return res.json({ error: "Password doesn't macth" })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.findByIdAndUpdate(req.user, { password: hashedPassword })

        //Send Email
        const emailData = {
            to: user.email,
            subject: 'Password Updated!',
            html: `<h3>Your password has been Updated!</h3>
                    <p>Your Username is: <b>${user.username}</b></p>`
        }
        SendEmail(emailData);



        res.json({ massage: 'Your Password has been Updated!' })

    } catch (error) {
        console.log(error)
    }
};

//All User
exports.users = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'Success',
            massage: 'All User',
            Data: users
        })
    } catch (error) {
        console.log(error)
    }
};

//Send OTP for Reset Password
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ massage: 'email is required' })
        }

        const existingUser = await User.findOne({ email });


        if (!existingUser) {
            return res.json({ massage: 'User not found' })
        }
        //Create OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        await OTPModel.create({ email, otp });

        //Create Email Data
        const emailData = {
            to: email,
            subject: 'Reset Password',
            html: `<h2>Your Verification Code is: ${otp}</h2>
                    <h5>Code is Expire after in 5 minutes</h5>`
        }

        //Email Send
        SendEmail(emailData)

        res.json({ status: 'Success', massage: `Email Sent Success for Reset Password. Please check your email: ${email}` })


        // req.user = existingUser;
        // //Send Email
        // const subject = 'Verification Code for Recover Password';
        // const text = 'Verification Code: 455121';

        // SendEmail(email, text, subject)

        // res.status(200).json({
        //     status: 'Success',
        //     massage: 'We was sent a verification code on your email'
        // });
    } catch (error) {
        console.log(error)
    }

};

//Verify OTP For Reset Password
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const userOtp = await OTPModel.findOne({ email, otp });
        const expireOtp = new Date() - userOtp.createdAt;

        const seconds = Math.floor(expireOtp / 1000);

        if (seconds > 300) {
            return res.json({ error: 'Code is expire' })
        }
        if (userOtp.status === 1) {
            return res.json({ error: 'Code is Already Used' })
        }

        await OTPModel.updateOne({ email, otp }, { status: 1 })

        res.json({ massage: 'Otp Verification Success. Now You are access in reset password!' })
    } catch (error) {
        res.json({ error: 'Invalid Code' })
    }
};

//Reset Password After Verify OTP
exports.resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            res.json({ massage: "Password doesn't match" })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.findOneAndUpdate({ email }, {
            password: hashedPassword
        },
            { new: true }
        );

        //Send Email
        const emailData = {
            to: email,
            subject: 'Reset Password Success',
            html: `<h3>Your password has been Reset!</h3>
                    <p>Your Username is: <b>${user.username}</b></p>`
        }
        SendEmail(emailData);

        res.json({ massage: 'Your Password has been Reset! Please login and check email.' })

    } catch (error) {
        console.log(error)
    }
};




