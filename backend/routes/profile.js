const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authGate, requireHR } = require('../middleware/auth');

const prisma = new PrismaClient();

// 1. Get Current User's Profile
router.get('/', authGate, async (req, res, next) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id }
    });
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// 2. HR Only: Get All Employees (for switcher / list)
router.get('/all', authGate, requireHR, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: { profile: true }
    });
    
    // Sanitize user passwords
    const sanitized = users.map(u => ({
      id: u.id,
      employeeId: u.employeeId,
      email: u.email,
      role: u.role,
      isVerified: u.isVerified,
      profile: u.profile
    }));

    res.json(sanitized);
  } catch (error) {
    next(error);
  }
});

// 3. Get Specific User's Profile (HR only or Self)
router.get('/:userId', authGate, async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== 'HR' && req.user.id !== userId) {
      return res.status(403).json({ error: "Access denied: Unauthorized access to profile." });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// 4. Update Current User's Profile (Self - Edit limited fields: address, phone, profilePicture)
router.put('/', authGate, async (req, res, next) => {
  try {
    const { address, phone, profilePicture } = req.body;

    const updated = await prisma.profile.update({
      where: { userId: req.user.id },
      data: {
        address: address !== undefined ? address : undefined,
        phone: phone !== undefined ? phone : undefined,
        profilePicture: profilePicture !== undefined ? profilePicture : undefined
      }
    });

    res.json({ message: "Profile updated successfully.", profile: updated });
  } catch (error) {
    next(error);
  }
});

// 5. HR Only: Update Any Employee Profile (All details including job details, salary structure)
router.put('/:userId', authGate, requireHR, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { 
      firstName, 
      lastName, 
      address, 
      phone, 
      profilePicture, 
      jobTitle, 
      department,
      baseSalary,
      allowances,
      deductions
    } = req.body;

    const updated = await prisma.profile.update({
      where: { userId },
      data: {
        firstName: firstName !== undefined ? firstName : undefined,
        lastName: lastName !== undefined ? lastName : undefined,
        address: address !== undefined ? address : undefined,
        phone: phone !== undefined ? phone : undefined,
        profilePicture: profilePicture !== undefined ? profilePicture : undefined,
        jobTitle: jobTitle !== undefined ? jobTitle : undefined,
        department: department !== undefined ? department : undefined,
        baseSalary: baseSalary !== undefined ? Number(baseSalary) : undefined,
        allowances: allowances !== undefined ? Number(allowances) : undefined,
        deductions: deductions !== undefined ? Number(deductions) : undefined
      }
    });

    res.json({ message: "Employee profile updated successfully.", profile: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
