const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-local-key-for-hrms-12345!";

async function authGate(req, res, next) {
  try {
    let token = null;

    // 1. Try to read token from cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // 2. Try to read token from authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Access denied: No session token provided" });
    }

    // 3. Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Access denied: Invalid session token" });
    }

    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: "Access denied: Invalid token payload" });
    }

    // 4. Hard database query: Check if the user exists and is verified/active in our database
    const dbUser = await prisma.user.findUnique({
      where: { email: decoded.email },
      include: { profile: true }
    });

    if (!dbUser) {
      // Unregistered or unauthorized email attempting to access endpoints
      return res.status(401).json({ error: "Access denied: Unauthorized email identity" });
    }

    // Attach user record and profile details to req for downstream routes
    req.user = dbUser;
    next();
  } catch (error) {
    next(error); // Forward to global error handler
  }
}

// Helper middleware to restrict access to HR officers only
function requireHR(req, res, next) {
  if (!req.user || req.user.role !== 'HR') {
    return res.status(403).json({ error: "Forbidden: This resource requires HR privileges" });
  }
  next();
}

module.exports = {
  authGate,
  requireHR
};
