const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authGate, requireHR } = require('../middleware/auth');

const prisma = new PrismaClient();

// Helper to get all dates between two dates
function getDatesInRange(start, end) {
  const dates = [];
  let current = new Date(start);
  const last = new Date(end);
  
  // Set times to midnight to avoid timezone mismatches
  current.setUTCHours(0, 0, 0, 0);
  last.setUTCHours(0, 0, 0, 0);

  while (current <= last) {
    dates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

// 1. Apply for Leave (Employee)
router.post('/', authGate, async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, remarks } = req.body;

    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields: leaveType, startDate, and endDate." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date formats." });
    }

    if (start > end) {
      return res.status(400).json({ error: "Start date cannot be after end date." });
    }

    // Create the leave request
    const newRequest = await prisma.leaveRequest.create({
      data: {
        userId: req.user.id,
        leaveType,
        startDate: start,
        endDate: end,
        remarks: remarks || "",
        status: 'PENDING'
      }
    });

    res.status(201).json({ message: "Leave request submitted successfully.", request: newRequest });
  } catch (error) {
    next(error);
  }
});

// 2. Get Leave Requests (Self for Employees, All for HR)
router.get('/', authGate, async (req, res, next) => {
  try {
    let requests;
    if (req.user.role === 'HR') {
      requests = await prisma.leaveRequest.findMany({
        include: {
          user: {
            include: { profile: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      requests = await prisma.leaveRequest.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' }
      });
    }
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

// 3. Approve or Reject Leave Request (HR Only)
router.put('/:requestId', authGate, requireHR, async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status, adminComment } = req.body;

    if (!status || (status !== 'APPROVED' && status !== 'REJECTED')) {
      return res.status(400).json({ error: "Status must be either APPROVED or REJECTED." });
    }

    // Find the leave request
    const leaveReq = await prisma.leaveRequest.findUnique({
      where: { id: requestId }
    });

    if (!leaveReq) {
      return res.status(404).json({ error: "Leave request not found." });
    }

    // Update in database transaction
    const updated = await prisma.$transaction(async (tx) => {
      const updatedReq = await tx.leaveRequest.update({
        where: { id: requestId },
        data: {
          status,
          adminComment: adminComment || ""
        }
      });

      // If approved, automatically create LEAVE attendance entries for each date in the range
      if (status === 'APPROVED') {
        const dates = getDatesInRange(leaveReq.startDate, leaveReq.endDate);

        for (const date of dates) {
          // Upsert attendance record for the date
          await tx.attendance.upsert({
            where: {
              userId_date: {
                userId: leaveReq.userId,
                date: date
              }
            },
            update: {
              status: 'LEAVE',
              checkIn: null,
              checkOut: null
            },
            create: {
              userId: leaveReq.userId,
              date: date,
              status: 'LEAVE'
            }
          });
        }
      }

      return updatedReq;
    });

    res.json({ message: `Leave request has been ${status.toLowerCase()} successfully.`, request: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
