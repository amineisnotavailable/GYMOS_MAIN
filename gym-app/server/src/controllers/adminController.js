const adminService = require('../services/adminService');
const notificationService = require('../services/notificationService');

exports.getUsers = async (req, res) => {
  const users = await adminService.getAllUsers();
  res.json(users);
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, position, salary, schedule, email, password } = req.body;
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcryptjs');
    const prisma = new PrismaClient();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'EMPLOYEE',
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
      }
    });

    const employee = await prisma.employee.create({
      data: {
        userId: user.id,
        name,
        position,
        salary: parseFloat(salary),
        schedule: schedule || null,
      }
    });

    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.pushNotification = async (req, res) => {
  const { userIds, message, type } = req.body;
  // userIds can be array or 'all'
  const recipients = userIds === 'all' ? await adminService.getAllUserIds() : userIds;
  const notifications = await Promise.all(
    recipients.map(uid => notificationService.createNotification({ recipientId: uid, senderId: req.user.id, message, type }))
  );
  res.status(201).json(notifications);
};

exports.getReports = async (req, res) => {
  const reports = await adminService.generateReports();
  res.json(reports);
};

// Get all pending coach profiles
exports.getPendingCoaches = async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const pending = await prisma.coachProfile.findMany({
      where: { isApproved: false },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } }
    });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve a coach
exports.approveCoach = async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const { id } = req.params;   // coachProfile id

    const updated = await prisma.coachProfile.update({
      where: { id: parseInt(id) },
      data: { isApproved: true },
      include: { user: { select: { id: true, email: true, firstName: true } } }
    });

    // Notify the coach that they've been approved
    await require('../services/notificationService').createNotification({
      recipientId: updated.user.id,
      senderId: req.user.id,
      message: 'Your coach account has been approved! You can now log in.',
      type: 'COACH_APPROVED',
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject (delete) a pending coach
exports.rejectCoach = async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const { id } = req.params;   // coachProfile id

    // Find the coach profile to get userId
    const coachProfile = await prisma.coachProfile.findUnique({
      where: { id: parseInt(id) },
      select: { userId: true, user: { select: { email: true, firstName: true } } }
    });

    if (!coachProfile) {
      return res.status(404).json({ error: 'Coach profile not found' });
    }

    // Delete the coach profile first, then the user
    await prisma.coachProfile.delete({ where: { id: parseInt(id) } });
    await prisma.user.delete({ where: { id: coachProfile.userId } });

    // Optionally notify the coach (they won't exist anymore, but maybe admin wants a log)
    // We'll just return success
    res.json({ message: 'Coach request rejected and account deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await require('../services/notificationService').getNotificationsForUser(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGymRevenue = async (req, res) => {
  const revenue = await require('../services/revenueService').getGymRevenue();
  res.json(revenue);
};

// Create an employer account
exports.createEmployer = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcryptjs');
    const prisma = new PrismaClient();

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    // Create user with role EMPLOYER
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'EMPLOYER',
        firstName,
        lastName,
        phone: phone || null,
      },
    });

    // Create employer profile
    await prisma.employerProfile.create({
      data: { userId: user.id },
    });

    res.status(201).json({
      message: 'Employer account created successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all employees (for admin / owner)
exports.getEmployees = async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};