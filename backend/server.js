require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const lawRoutes = require('./src/routes/lawRoutes');
const authRoutes = require('./src/routes/authRoutes');
const requestLogger = require('./src/middlewares/requestLogger');
const { notFound, errorHandler } = require('./src/middlewares/errorHandler');

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Basic Route
app.get('/', (req, res) => {
  res.send('Indian Law Penal Code API is running...');
});

app.use('/api/v1/laws', lawRoutes);
app.use('/api/v1/auth', authRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
