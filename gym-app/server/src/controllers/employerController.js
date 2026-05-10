const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const walletService = require('../services/walletService');
const revenueService = require('../services/revenueService');
const notificationService = require('../services/notificationService');

// Gym revenue (for dashboard)
exports.getGymRevenue = async (req, res) => {
  try { res.json(await revenueService.getGymRevenue()); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

// All users (for pay‑user dropdown & notifications)
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, firstName: true, lastName: true }
    });
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Pay a user from gym revenue
exports.payUser = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    const revenue = await revenueService.getGymRevenue();
    if (revenue.totalRevenue < amount) return res.status(400).json({ error: 'Insufficient gym revenue' });

    // Deduct from gym revenue
    await prisma.gymRevenue.update({ where: { id: revenue.id }, data: { totalRevenue: revenue.totalRevenue - amount } });
    // Add to user wallet
    await walletService.topUp(userId, amount);
    res.json({ message: 'Payment sent' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// List all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Hire a new employee (creates user + employee record)
exports.createEmployee = async (req, res) => {
  try {
    const { name, position, salary, schedule, email, password } = req.body;
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashed,
        role: 'EMPLOYEE',
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
      }
    });

    const emp = await prisma.employee.create({
      data: {
        userId: user.id,
        name,
        position,
        salary: parseFloat(salary),
        schedule: schedule || null,
      }
    });

    res.status(201).json(emp);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Withdrawal requests
exports.getWithdrawalRequests = async (req, res) => {
  try {
    const reqs = await prisma.withdrawalRequest.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { firstName: true, lastName: true, email: true } } }
    });
    res.json(reqs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.approveWithdrawal = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const wd = await prisma.withdrawalRequest.findUnique({ where: { id } });
    if (!wd || wd.status !== 'PENDING') return res.status(404).json({ error: 'Not found' });

    const wallet = await walletService.getOrCreateWallet(wd.userId);
    if (wallet.balance < wd.amount) {
      await prisma.withdrawalRequest.update({ where: { id }, data: { status: 'REJECTED' } });
      return res.status(400).json({ error: 'Insufficient funds in user wallet' });
    }

    await prisma.wallet.update({ where: { userId: wd.userId }, data: { balance: wallet.balance - wd.amount } });
    await prisma.withdrawalRequest.update({ where: { id }, data: { status: 'APPROVED' } });
    res.json({ message: 'Approved' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.rejectWithdrawal = async (req, res) => {
  try {
    await prisma.withdrawalRequest.update({ where: { id: parseInt(req.params.id) }, data: { status: 'REJECTED' } });
    res.json({ message: 'Rejected' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Notifications
exports.sendNotification = async (req, res) => {
  try {
    const { recipientId, message, type } = req.body;
    const n = await notificationService.createNotification({
      recipientId: parseInt(recipientId),
      senderId: req.user.id,
      message,
      type: type || 'GENERAL'
    });
    res.status(201).json(n);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifs = await notificationService.getNotificationsForUser(req.user.id);
    res.json(notifs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};