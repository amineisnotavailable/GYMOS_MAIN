const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/roleCheck');
const ctrl = require('../controllers/adminController');

router.use(auth, role('ADMIN', 'OWNER'));

router.get('/users', ctrl.getUsers);
router.post('/employees', ctrl.createEmployee);
router.post('/notifications', ctrl.pushNotification);
router.get('/reports', ctrl.getReports);
router.get('/pending-coaches', ctrl.getPendingCoaches);
router.put('/approve-coach/:id', ctrl.approveCoach);
router.delete('/reject-coach/:id', ctrl.rejectCoach);
router.get('/notifications', ctrl.getNotifications);
router.get('/revenue', ctrl.getGymRevenue);
router.post('/employers', ctrl.createEmployer);

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
// ... other admin routes
module.exports = router;