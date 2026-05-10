const userService = require('../services/userService');
const athleteService = require('../services/athleteService');
const coachService = require('../services/coachService');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

exports.register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phone, ...profileData } = req.body;
    const existing = await userService.findByEmail(email);
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const user = await userService.createUser({ email, password, role, firstName, lastName, phone });

    if (role === 'ATHLETE') {
      const sportIds = profileData.sportIds || [];
      delete profileData.sportIds;

      const profile = await athleteService.createProfile(user.id, profileData);

      if (Array.isArray(sportIds) && sportIds.length > 0) {
        for (const sportId of sportIds) {
          await athleteService.addSport(profile.id, parseInt(sportId));
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
        jwtSecret,
        { expiresIn: '7d' }
      );
      return res.status(201).json({
        token,
        user: { id: user.id, email, role: user.role, firstName, lastName },
      });
    } else if (role === 'COACH') {
      await coachService.createProfile(user.id, {
        specialty: profileData.specialty || null,
      });

      try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const admins = await prisma.user.findMany({
          where: { role: 'ADMIN' },
          select: { id: true },
        });
        const notificationService = require('../services/notificationService');
        for (const admin of admins) {
          await notificationService.createNotification({
            recipientId: admin.id,
            senderId: user.id,
            message: `New coach ${user.firstName} ${user.lastName} (${user.email}) needs approval.`,
            type: 'COACH_APPROVAL',
          });
        }
      } catch (notifErr) {
        console.error('Failed to send coach approval notification:', notifErr);
      }

      return res.status(201).json({
        message: 'Coach account created successfully. Please log in. It will be activated after admin approval.',
        user: { id: user.id, email, role: user.role, firstName, lastName },
      });
    } else {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
        jwtSecret,
        { expiresIn: '7d' }
      );
      return res.status(201).json({
        token,
        user: { id: user.id, email, role: user.role, firstName, lastName },
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await userService.validatePassword(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    let isApproved = true;
    if (user.role === 'COACH') {
      const coachProfile = await coachService.getProfileByUserId(user.id);
      isApproved = coachProfile?.isApproved ?? false;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isApproved,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isApproved,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};