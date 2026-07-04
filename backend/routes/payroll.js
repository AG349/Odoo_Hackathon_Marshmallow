const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authGate, requireHR } = require('../middleware/auth');

const prisma = new PrismaClient();

// Helper to compute net salary
function calculateNetSalary(base, allowances, deductions) {
  const b = Number(base) || 0;
  const a = Number(allowances) || 0;
  const d = Number(deductions) || 0;
  return (b + a - d).toFixed(2);
}

// 1. Get Payroll View (Self for Employee, All for HR)
router.get('/', authGate, async (req, res, next) => {
  try {
    if (req.user.role === 'HR') {
      const employees = await prisma.user.findMany({
        include: { profile: true }
      });

      const payrollList = employees.map(emp => {
        const profile = emp.profile || {};
        const base = profile.baseSalary || 0;
        const allowances = profile.allowances || 0;
        const deductions = profile.deductions || 0;
        const net = calculateNetSalary(base, allowances, deductions);

        return {
          userId: emp.id,
          employeeId: emp.employeeId,
          email: emp.email,
          fullName: profile.firstName ? `${profile.firstName} ${profile.lastName}` : 'New User',
          jobTitle: profile.jobTitle || 'N/A',
          department: profile.department || 'N/A',
          baseSalary: base,
          allowances: allowances,
          deductions: deductions,
          netSalary: net
        };
      });

      res.json(payrollList);
    } else {
      // Standard employee gets their own details read-only
      const profile = await prisma.profile.findUnique({
        where: { userId: req.user.id }
      });

      if (!profile) {
        return res.status(404).json({ error: "Profile not found." });
      }

      const base = profile.baseSalary || 0;
      const allowances = profile.allowances || 0;
      const deductions = profile.deductions || 0;
      const net = calculateNetSalary(base, allowances, deductions);

      res.json({
        userId: req.user.id,
        employeeId: req.user.employeeId,
        email: req.user.email,
        fullName: `${profile.firstName} ${profile.lastName}`,
        jobTitle: profile.jobTitle,
        department: profile.department,
        baseSalary: base,
        allowances: allowances,
        deductions: deductions,
        netSalary: net
      });
    }
  } catch (error) {
    next(error);
  }
});

// 2. HR Only: Update Salary Structure of an Employee
router.put('/:userId', authGate, requireHR, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { baseSalary, allowances, deductions } = req.body;

    if (baseSalary === undefined && allowances === undefined && deductions === undefined) {
      return res.status(400).json({ error: "At least one salary component must be provided for update." });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return res.status(404).json({ error: "Employee profile not found." });
    }

    const updated = await prisma.profile.update({
      where: { userId },
      data: {
        baseSalary: baseSalary !== undefined ? Number(baseSalary) : undefined,
        allowances: allowances !== undefined ? Number(allowances) : undefined,
        deductions: deductions !== undefined ? Number(deductions) : undefined
      }
    });

    const net = calculateNetSalary(updated.baseSalary, updated.allowances, updated.deductions);

    res.json({
      message: "Salary structure updated successfully.",
      payroll: {
        userId: updated.userId,
        baseSalary: updated.baseSalary,
        allowances: updated.allowances,
        deductions: updated.deductions,
        netSalary: net
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
