import mongoose from 'mongoose';
import dns from 'dns';

// Ensure DNS resolution succeeds for mongodb+srv across various networks and cloud environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore fallback if restricted
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('CRITICAL: process.env.MONGO_URI is undefined! Please check Environment Variables or /etc/secrets/.env');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't kill the server process so Render health checks don't fail with 502
  }
};

export default connectDB;

