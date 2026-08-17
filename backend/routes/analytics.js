const express = require('express');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/analytics/stats
// @desc    Get user statistics for the admin dashboard
// @access  Private (Future: Add middleware to ensure only admin can access)
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const touristCount = await User.countDocuments({ role: 'tourist' });
    const guideCount = await User.countDocuments({ role: 'guide' });
    const sellerCount = await User.countDocuments({ role: 'seller' });

    res.json({
      totalUsers,
      touristCount,
      guideCount,
      sellerCount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
