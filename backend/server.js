require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Standard middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static assets from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Import Routers
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const attendanceRouter = require('./routes/attendance');
const leavesRouter = require('./routes/leaves');
const payrollRouter = require('./routes/payroll');

// Placeholder index route for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', time: new Date().toISOString() });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/leaves', leavesRouter);
app.use('/api/payroll', payrollRouter);

// --- GLOBAL EXCEPTION HANDLER ---
// Captures any unhandled errors in route controllers, logging the trace
// internally while serving a clean, sanitized JSON error response.
app.use((err, req, res, next) => {
  // Log the complete error trace on the server terminal for debugging
  console.error('SERVER FAULT DETECTED:');
  console.error(err.stack || err);

  // Return a user-friendly, sanitized HTTP 500 error instead of hanging or crashing
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred on the server. Please try again later.'
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`HRMS Application running locally at http://localhost:${PORT}`);
});

module.exports = app;
