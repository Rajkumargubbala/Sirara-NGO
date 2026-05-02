const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
})); 

const allowedOrigins = [
  'http://localhost:3000', 'http://127.0.0.1:3000',
  'http://localhost:3001', 'http://127.0.0.1:3001',
  'http://localhost:5173', 'http://127.0.0.1:5173',
  'http://192.168.1.8:3000', 'http://192.168.1.8:3001'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
})); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
});
app.use('/api', limiter);

// Routes
app.get('/', (req, res) => {
  res.send('Sitara API is running...');
});

app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
