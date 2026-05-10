const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all athlete profiles (basic info)
exports.getAllAthletes = async (req, res) => {
  try {
    const athletes = await prisma.athleteProfile.findMany({
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } }
      }
    });
    res.json(athletes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark attendance for an athlete
exports.markAttendance = async (req, res) => {
  try {
    const { athleteId, sessionId, status, date } = req.body;
    // sessionId is optional; if not provided, create a standalone attendance record
    const attendance = await prisma.attendance.create({
      data: {
        athleteId: parseInt(athleteId),
        sessionId: sessionId ? parseInt(sessionId) : null,
        status: status || 'PRESENT',   // PRESENT, ABSENT, EXCUSED
        date: date ? new Date(date) : new Date(),
      }
    });
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get notifications for the employee
exports.getNotifications = async (req, res) => {
  try {
    const notifs = await prisma.notification.findMany({
      where: { recipientId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a notification from the employee
exports.sendNotification = async (req, res) => {
  try {
    const { recipientId, message, type } = req.body;
    const notif = await prisma.notification.create({
      data: {
        recipientId: parseInt(recipientId),
        senderId: req.user.id,
        message,
        type: type || 'GENERAL'
      }
    });
    res.status(201).json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true
      }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};