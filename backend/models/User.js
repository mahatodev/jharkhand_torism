const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['tourist', 'guide', 'seller', 'admin']
  },
  govtId: { // Aadhaar for verification
    type: String,
    default: null
  },
  isVerified: { // Admin dwara verification ke liye
    type: Boolean,
    default: false
  },
  qualifications: { // Guide ke liye
    type: [String],
    default: []
  },
  pricePerDay: { // Guide ke liye
    type: Number,
    default: 2000
  },
  bankAccount: { // Guide aur Seller ke liye
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
  },
  upiId: {
    type: String,
    trim: true,
    default: null
  },
  cart: [{ // Tourist ke liye
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);

