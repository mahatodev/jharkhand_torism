const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Only for admins.' });
    }
    next();
};

// Get all users for verification
router.get('/verifiable-users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['guide', 'seller'] } }).select('-password -cart');
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Verify a user
router.put('/verify/:userId', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        user.isVerified = true;
        await user.save();
        res.json({ msg: 'User verified', user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all transactions
router.get('/transactions', auth, isAdmin, async (req, res) => {
    // ... (same as before)
});

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password -cart');
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete a user
router.delete('/user/:userId', auth, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        // Also delete their products if they are a seller
        await Product.deleteMany({ seller: req.params.userId });
        res.json({ msg: 'User and their products deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all products
router.get('/products', auth, isAdmin, async (req, res) => {
    // ... (same as before)
});

// Delete a product
router.delete('/product/:productId', auth, isAdmin, async (req, res) => {
    // ... (same as before)
});

module.exports = router;

