// 1. Load environment variables IMMEDIATELY at the top
require('dotenv').config();

// 2. Import all necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 3. Initialize the Express app
const app = express();

// 4. Middlewares - These run for every request
app.use(cors()); // Allows your React app to talk to this server
app.use(express.json()); // Allows the server to understand JSON data

// 5. Connect to your MongoDB database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully! ✅'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 6. Define a simple test route to check if the server is running
app.get('/', (req, res) => {
  res.send('Jharkhand Tourism API is running!');
});

// 7. Use all the API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/guides', require('./routes/guides'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/products', require('./routes/products'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));

// 8. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT} 🚀`));

