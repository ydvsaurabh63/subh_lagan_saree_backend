import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Support Render Secret Files mount path
if (fs.existsSync('/etc/secrets/.env')) {
  dotenv.config({ path: '/etc/secrets/.env' });
}
// 2. Support local backend/.env and project root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares with flexible CORS for Vercel
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://subhlagansareefrontend.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: isDbConnected ? 'OK' : 'DEGRADED',
    database: isDbConnected ? 'connected' : 'disconnected',
    message: 'Subh Lagan Sarees API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Port & Server Listen - bind to 0.0.0.0 for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Subh Lagan Sarees Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
