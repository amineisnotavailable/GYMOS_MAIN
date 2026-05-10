const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/roleCheck');
const ctrl = require('../controllers/employeeController');

router.use(auth, role('EMPLOYEE'));

router.get('/athletes', ctrl.getAllAthletes);
router.post('/attendance', ctrl.markAttendance);
router.get('/notifications', ctrl.getNotifications);
router.post('/notifications', ctrl.sendNotification);
router.get('/users', ctrl.getUsers);

router.put('/notifications/:id/read', async (req, res) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    await prisma.notification.update({
      where: { id: parseInt(req.params.id) },
      data: { isRead: true },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;