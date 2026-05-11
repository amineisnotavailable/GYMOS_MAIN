const coachService = require('../services/coachService')
const athleteService = require('../services/athleteService')
const notificationService = require('../services/notificationService')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.getMyAthletes = async (req, res) => {
  try {
    const athletes = await coachService.getMyAthletes(req.user.id)
    res.json(athletes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Returns ALL athlete profiles, and automatically creates one for any athlete user that lacks it
exports.getAllAthletes = async (req, res) => {
  try {
    // 1. Find athlete users who don't have a profile
    const usersWithoutProfile = await prisma.user.findMany({
      where: {
        role: 'ATHLETE',
        athleteProfile: null
      },
      select: { id: true }
    })

    // 2. Create a default profile for each
    for (const user of usersWithoutProfile) {
      await prisma.athleteProfile.create({
        data: {
          userId: user.id,
          maturity: 'ADULT',
          level: 'AMATEUR',
          competitionValidity: false,
        }
      })
    }

    // 3. Now return all profiles (including the ones just created)
    const athletes = await athleteService.getAllAthletes()
    res.json(athletes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.assignAthlete = async (req, res) => {
  try {
    const { athleteId } = req.body
    const athlete = await athleteService.assignCoach(parseInt(athleteId), req.user.id)
    res.json(athlete)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getSchedule = async (req, res) => {
  try {
    const schedule = await coachService.getMySchedule(req.user.id)
    res.json(schedule)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.createSession = async (req, res) => {
  try {
    const sessionData = { ...req.body, coachId: req.user.id }
    const session = await coachService.createSession(sessionData)
    res.status(201).json(session)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.sendReminder = async (req, res) => {
  try {
    const { athleteUserId, message } = req.body
    const notification = await notificationService.createNotification({
      recipientId: athleteUserId,
      senderId: req.user.id,
      message,
      type: 'REMINDER',
    })
    const athleteProfile = await athleteService.getProfile(athleteUserId)
    if (athleteProfile && athleteProfile.maturity === 'MINOR' && athleteProfile.parentContact) {
      await notificationService.createNotification({
        recipientId: athleteUserId,
        senderId: req.user.id,
        message: `Parent alert: ${message}`,
        type: 'PARENT_REMINDER',
      })
      const emailService = require('../services/emailService')
      emailService.sendParentNotification(athleteProfile.parentContact, message)
    }
    res.status(201).json(notification)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Send a generic notification from the coach
exports.sendNotification = async (req, res) => {
  try {
    const { recipientId, message, type } = req.body;
    const notification = await notificationService.createNotification({
      recipientId: parseInt(recipientId),
      senderId: req.user.id,
      message,
      type: type || 'GENERAL',
    });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (for sending notifications)
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAthleteLevel = async (req, res) => {
  try {
    const athleteId = parseInt(req.params.id);
    const { level } = req.body;
    if (!['AMATEUR', 'INTERMEDIATE', 'PROFESSIONAL'].includes(level)) {
      return res.status(400).json({ error: 'Invalid level' });
    }
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const athlete = await prisma.athleteProfile.findUnique({ where: { id: athleteId } });
    if (!athlete || athlete.coachId !== req.user.id) {
      return res.status(403).json({ error: 'Not allowed' });
    }
    const updated = await prisma.athleteProfile.update({
      where: { id: athleteId },
      data: { level },
    });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
};