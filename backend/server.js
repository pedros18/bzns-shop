import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { db } from './config/db.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Allow frontend dev server and production to call the API
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://bzns-shop.vercel.app',
      'https://bzns-shop-pedros18s-projects.vercel.app',
      'https://bzns-shop-git-main-pedros18s-projects.vercel.app',
      'https://bzns-shop-4eeeui5br-pedros18s-projects.vercel.app',
      'https://beznes.vercel.app'
    ];

    // Allow exact matches or regex matches
    const allowedRegex = [
      /^https:\/\/bzns-shop.*\.vercel\.app$/,
      /^https:\/\/.*--bzns-shop.*\.vercel\.app$/
    ];

    if (!origin) {
      // Allow requests with no origin (like mobile apps or curl)
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin) || allowedRegex.some(rx => rx.test(origin))) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use('/api/products', productRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/orders', orderRoutes);

// Root route for Railway healthcheck
app.get('/', (req, res) => {
  res.json({ 
    message: 'bzns API is running successfully!', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

async function initDB() {
  try {
    await db`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    // Columns for richer product data
    await db`ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(255);`;
    await db`ALTER TABLE products ADD COLUMN IF NOT EXISTS old_price DECIMAL(10,2);`;
    await db`ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];`;
    await db`ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes TEXT[];`;
    await db`ALTER TABLE products ADD COLUMN IF NOT EXISTS colors TEXT[];`;

    // Ensure updated_at exists (older deployments)
    await db`ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`;

    // New: orders table to store client info and selected options
    await db`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        product_name VARCHAR(255) NOT NULL,
        product_price DECIMAL(10,2) NOT NULL,
        product_image VARCHAR(255),
        qty INTEGER NOT NULL DEFAULT 1,
        color VARCHAR(64),
        size VARCHAR(64),
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        wilaya VARCHAR(128) NOT NULL,
        commune VARCHAR(128),
        username VARCHAR(255),
        notes TEXT,
        status VARCHAR(32) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });    
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
