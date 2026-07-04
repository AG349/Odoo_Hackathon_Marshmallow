const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { authGate } = require('../middleware/auth');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-local-key-for-hrms-12345!";

// 1. Sign Up Route
router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { employeeId, email, password, role } = req.body;

    // A. Check Pre-Authorization Gate: Does the email and employee ID exist in PreAuthorizedEmail?
    const preAuth = await prisma.preAuthorizedEmail.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!preAuth || preAuth.employeeId !== employeeId || preAuth.role !== role) {
      return res.status(400).json({ 
        error: 'Access denied: Email identity or Employee ID is not pre-authorized or matches no roles.' 
      });
    }

    // B. Check if User is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    if (existingUser) {
      return res.status(400).json({ error: 'This email is already registered.' });
    }

    const existingEmpId = await prisma.user.findUnique({
      where: { employeeId }
    });
    if (existingEmpId) {
      return res.status(400).json({ error: 'This Employee ID is already registered.' });
    }

    // C. Hash password using bcryptjs with 12 salt rounds
    const passwordHash = await bcrypt.hash(password, 12);

    // D. Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // E. Save user in a database transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          employeeId,
          email: email.toLowerCase(),
          password: passwordHash,
          role,
          isVerified: false,
          verificationToken
        }
      });

      // Parse default names from email for premium UX
      let firstName = 'New';
      let lastName = 'User';
      const namePart = email.split('@')[0];
      if (namePart.includes('.')) {
        const parts = namePart.split('.');
        firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
      } else {
        firstName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }

      await tx.profile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          jobTitle: role === 'HR' ? 'HR Officer' : 'Software Engineer',
          department: role === 'HR' ? 'Human Resources' : 'Engineering',
          address: '',
          phone: '',
          profilePicture: '',
          baseSalary: role === 'HR' ? 8500.00 : 6000.00,
          allowances: 500.00,
          deductions: 200.00
        }
      });

      return user;
    });

    // F. Simulated console verification link logging (offline-friendly)
    const verificationLink = `http://localhost:${process.env.PORT || 3000}/api/auth/verify?token=${verificationToken}`;
    console.log(`\n=============================================================`);
    console.log(`[OFFLINE EMAIL SIMULATOR] Verification link for user (${email}):`);
    console.log(verificationLink);
    console.log(`=============================================================\n`);

    res.status(201).json({
      message: 'Registration successful! Verification email simulated. Check your terminal/server console to verify your email.'
    });
  } catch (error) {
    next(error);
  }
});

// 2. Email Verification Route
router.get('/verify', async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send('<h1>Verification Error</h1><p>Missing verification token.</p>');
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(400).send('<h1>Verification Error</h1><p>Invalid or expired verification token.</p>');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null
      }
    });

    // Send a premium HTML verification completion page that automatically redirects
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Email Verified Successfully</title>
        <style>
          body {
            background: #0f0c20;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
          }
          h1 { color: #00ffcc; margin-bottom: 10px; }
          a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 24px;
            background: linear-gradient(135deg, #00ffcc, #0099ff);
            color: #0f0c20;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            transition: opacity 0.2s;
          }
          a:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Verification Successful!</h1>
          <p>Your email has been verified. You can now close this tab or return to login.</p>
          <a href="/">Go to Login</a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
});

// 3. Login Route
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include profile
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Incorrect credentials.' });
    }

    // Check password hashing
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect credentials.' });
    }

    // Check verification status
    if (!user.isVerified) {
      return res.status(401).json({ error: 'Please verify your email before logging in.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role, 
        employeeId: user.employeeId 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true if running over HTTPS
      sameSite: 'lax',
      maxAge: 86400000 // 24 hours
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    next(error);
  }
});

// 4. Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully.' });
});

// 5. Get Current User Info
router.get('/me', authGate, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      employeeId: req.user.employeeId,
      email: req.user.email,
      role: req.user.role,
      profile: req.user.profile
    }
  });
});

module.exports = router;
