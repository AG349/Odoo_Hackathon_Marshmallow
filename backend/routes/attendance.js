const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authGate, requireHR } = require('../middleware/auth');

const prisma = new PrismaClient();

// Helper to get local date string (YYYY-MM-DD)
function getLocalDateString(date = new Date()) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
}

// 1. Check-In Route
router.post('/checkin', authGate, async (req, res, next) => {
  try {
    const todayStr = getLocalDateString();
    const today = new Date(todayStr);

    // Check if attendance already exists for today
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: req.user.id,
          date: today
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: "Already checked in today." });
    }

    const newRecord = await prisma.attendance.create({
      data: {
        userId: req.user.id,
        date: today,
        checkIn: new Date(),
        status: 'PRESENT'
      }
    });

    res.status(201).json({ message: "Checked in successfully.", record: newRecord });
  } catch (error) {
    next(error);
  }
});

// 2. Check-Out Route
router.post('/checkout', authGate, async (req, res, next) => {
  try {
    const todayStr = getLocalDateString();
    const today = new Date(todayStr);

    // Find today's attendance record
    const record = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: req.user.id,
          date: today
        }
      }
    });

    if (!record) {
      return res.status(400).json({ error: "You must check in first before checking out." });
    }

    if (record.checkOut) {
      return res.status(400).json({ error: "Already checked out today." });
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(record.checkIn);

    // Calculate duration in hours
    const durationHrs = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    // If worked less than 4 hours, it's considered a Half-day. Else Present.
    let status = 'PRESENT';
    if (durationHrs < 4.0) {
      status = 'HALF_DAY';
    }

    const updatedRecord = await prisma.attendance.update({
      where: { id: record.id },
      data: {
        checkOut: checkOutTime,
        status
      }
    });

    res.json({ 
      message: `Checked out successfully. Time logged: ${durationHrs.toFixed(2)} hours. Status: ${status}`, 
      record: updatedRecord 
    });
  } catch (error) {
    next(error);
  }
});

// 3. Get Attendance History (Self, or HR view target user)
router.get('/', authGate, async (req, res, next) => {
  try {
    const { userId, startDate, endDate } = req.query;
    
    // Target user ID is self, unless HR specifies another userId
    let targetUserId = req.user.id;
    if (userId && userId !== req.user.id) {
      if (req.user.role !== 'HR') {
        return res.status(403).json({ error: "Access denied: Cannot query other employees' logs." });
      }
      targetUserId = userId;
    }

    const filter = { userId: targetUserId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.lte = new Date(endDate);
      }
    }

    const records = await prisma.attendance.findMany({
      where: filter,
      orderBy: { date: 'desc' }
    });

    res.json(records);
  } catch (error) {
    next(error);
  }
});

// 4. HR Only: Get Current Day's Attendance for All Employees
router.get('/all-today', authGate, requireHR, async (req, res, next) => {
  try {
    const todayStr = getLocalDateString();
    const today = new Date(todayStr);

    const records = await prisma.attendance.findMany({
      where: { date: today },
      include: {
        user: {
          include: { profile: true }
        }
      }
    });

    res.json(records);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
