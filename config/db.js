import mongoose from 'mongoose';
import dns from 'dns';

// Ensure DNS resolution succeeds for mongodb+srv across various networks and cloud environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore fallback if restricted
}

let lastDbError = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    lastDbError = 'process.env.MONGO_URI is undefined. Add it in Render Secret Files (.env) or Environment Variables.';
    console.error(`CRITICAL: ${lastDbError}`);
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    lastDbError = null;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    lastDbError = error.message;
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't kill the server process so Render health checks don't fail with 502
  }
};

export const getLastDbError = () => lastDbError;

export const autoReconnectMiddleware = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
      lastDbError = null;
    } catch (e) {
      lastDbError = e.message;
    }
  }
  next();
};

export default connectDB;
