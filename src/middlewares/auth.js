const jwt = require('jsonwebtoken');
const User = require('../models/UsersModel');


//Check User Login 
exports.isLogin = (req, res, next) => {
    try {
        const token = req.headers.authentication;

        if (!token) {
            return res.json({ massage: 'Unauthorized' })
        };

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        req.user = decoded;

        next();
    } catch (error) {
        res.json({ massage: 'Unauthorized' });
    }
};

//Check Admin Login
exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user);
        const userRole = user.role;
        if (userRole !== 1) {
            return res.json({ massage: 'You are not Admin' })
        }
        next();
    } catch (error) {
        console.log(error)
    }
};

