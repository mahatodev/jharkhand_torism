const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get current user's full profile (including cart)
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('cart');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update profile
router.post('/update', auth, async (req, res) => {
  const { qualifications, bankAccount, upiId, pricePerDay } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (qualifications !== undefined) user.qualifications = qualifications;
    if (bankAccount) user.bankAccount = bankAccount;
    if (upiId) user.upiId = upiId;
    if (pricePerDay) user.pricePerDay = pricePerDay;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get my transactions (IDOR protected)
router.get('/my-transactions', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        let transactions;
        if (user.role === 'tourist') {
            transactions = await Transaction.find({ from: req.user.id }).populate('to', 'name').populate('product', 'name').sort({ createdAt: -1 });
        } else { // For guide and seller
            transactions = await Transaction.find({ to: req.user.id }).populate('from', 'name').populate('product', 'name').sort({ createdAt: -1 });
        }
        res.json(transactions);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Cart routes
router.post('/cart/add/:productId', auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { $addToSet: { cart: req.params.productId } });
        res.json({ msg: 'Item added to cart' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.delete('/cart/remove/:productId', auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { $pull: { cart: req.params.productId } });
        res.json({ msg: 'Item removed from cart' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;

