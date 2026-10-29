const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`! MongoDB Connection Warning: ${error.message}`);
    console.warn('  Ensure mongod is running locally on port 27017, or set MONGODB_URI in backend/.env');
    return false;
  }
};

module.exports = connectDB;

