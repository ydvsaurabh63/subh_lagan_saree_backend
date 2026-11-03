import mongoose from 'mongoose';
import dns from 'dns';

// Ensure DNS resolution succeeds for mongodb+srv across various networks and cloud environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore fallback if restricted
}

const ATLAS_PRODUCTION_URI =
  'mongodb+srv://diintechteam4_db_user:UJXPKfzqbkpQh6qU@cluster0.hhhir9p.mongodb.net/subh_lagan_sarees?appName=Cluster0';

export const getCleanMongoUri = () => {
  let uri = process.env.MONGO_URI;
  // If undefined or pointing to local loopback (which fails on Render), automatically route to MongoDB Atlas
  if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
    return ATLAS_PRODUCTION_URI;
  }
  return uri;
};

let lastDbError = null;

const connectDB = async () => {
  const uri = getCleanMongoUri();

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
  if (mongoose.connection.readyState !== 1) {
    try {
      const uri = getCleanMongoUri();
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      lastDbError = null;
    } catch (e) {
      lastDbError = e.message;
    }
  }
  next();
};

export default connectDB;
