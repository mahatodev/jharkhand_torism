const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const crypto = require('crypto'); // Hash banane ke liye
const Transaction = require('../models/Transaction');

// @route   POST /api/payment/process
// @desc    Payment process karein aur transaction record banayein
// @access  Private
router.post('/process', auth, async (req, res) => {
  const { to, amount, product } = req.body;
  try {
    const newTransaction = new Transaction({
      from: req.user.id,
      to,
      amount,
      product: product || undefined,
      // Random 64-character hash banayein
      transactionHash: crypto.randomBytes(32).toString('hex')
    });
    await newTransaction.save();
    res.json({ 
      msg: 'Payment Successful!', 
      transactionHash: newTransaction.transactionHash 
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;

