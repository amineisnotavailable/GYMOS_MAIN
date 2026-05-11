const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/roleCheck');
const ctrl = require('../controllers/employerController'); // reuse employer controller

router.use(auth, role('OWNER'));

// Pay a user (but exclude athletes)
router.post('/pay-user', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const { userId, amount } = req.body;

    // Check that the user is NOT an athlete
    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user || user.role === 'ATHLETE') {
      return res.status(400).json({ error: 'Cannot pay athletes.' });
    }

    // Reuse the employer pay logic
    return ctrl.payUser(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get users (filter out athletes for owner)
router.get('/users', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany({
      where: { role: { not: 'ATHLETE' } },
      select: { id: true, email: true, role: true, firstName: true, lastName: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Owner notifications (using employer controller)
router.get('/notifications', ctrl.getNotifications);
router.post('/notifications', ctrl.sendNotification);
router.put('/notifications/:id/read', async (req, res) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  await prisma.notification.update({ where: { id: parseInt(req.params.id) }, data: { isRead: true } });
  res.json({ success: true });
});

router.get('/users', async (req, res) => {
  // returns users except ATHLETE
  const users = await prisma.user.findMany({
    where: { role: { not: 'ATHLETE' } },
    select: { id: true, email: true, role: true, firstName: true, lastName: true }
  });
  res.json(users);
});

// Gym revenue
router.get('/revenue', ctrl.getGymRevenue);

module.exports = router;