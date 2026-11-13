const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seed_vault';
    console.log(`Connecting to MongoDB at: ${mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`[SeedVault] MongoDB Connected Successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[SeedVault] MongoDB Connection Error: ${error.message}`);
    console.warn('[SeedVault] Ensure mongod is running locally on port 27017 or MONGODB_URI is set.');
    // We do not exit immediately so server can provide friendly diagnostic endpoints if DB is down
    return null;
  }
};

module.exports = connectDB;

