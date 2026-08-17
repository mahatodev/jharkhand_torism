    const express = require('express');
    const User = require('../models/User'); // User model ko import karein
    const router = express.Router();

    // @route   GET /api/guides
    // @desc    'guide' bhumika wale sabhi users ko prapt karein
    // @access  Public (koi bhi logged-in user ise dekh sakta hai)
    router.get('/', async (req, res) => {
      try {
        // Database mein un sabhi users ko dhundhein jinki bhumika 'guide' hai
        // .select('-password -email') ka matlab hai ki hum password aur email jaisi sanvedansheel jaankari nahi bhejenge
        const guides = await User.find({ role: 'guide' }).select('-password -email');
        
        if (!guides || guides.length === 0) {
          return res.status(404).json({ msg: 'Koi guide nahi mila' });
        }

        res.json(guides);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server mein truti');
      }
    });

    module.exports = router;
    
