const jwt = require('jsonwebtoken');

// Yeh function ek middleware hai
module.exports = function(req, res, next) {
  // Step 1: Request ke header se token nikalein
  const token = req.header('x-auth-token');

  // Step 2: Check karein ki token hai ya nahi
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Step 3: Agar token hai, to use verify karein
  try {
    // Token ko secret key se decode karein
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Decoded user ki information ko request object mein daal dein
    req.user = decoded.user;
    
    // Request ko aage route tak jaane dein
    next();
  } catch (err) {
    // Agar token valid nahi hai to error bhejein
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

