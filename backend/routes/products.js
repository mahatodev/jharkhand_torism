const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const User = require('../models/User');

// @route   POST /api/products
// @desc    Naya product add karein
// @access  Private (Sirf sellers ke liye)
router.post('/', auth, async (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  try {
    const seller = await User.findById(req.user.id);
    if (seller.role !== 'seller') {
      return res.status(403).json({ msg: 'Only sellers can add products' });
    }
    const newProduct = new Product({
      name, description, price, imageUrl, seller: req.user.id
    });
    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/products
// @desc    Sabhi products prapt karein
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('seller', ['name', 'isVerified']);
    res.json(products);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;

