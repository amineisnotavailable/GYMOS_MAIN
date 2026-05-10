const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/roleCheck');
const ctrl = require('../controllers/employerController');

router.use(auth, role('EMPLOYER', 'OWNER'));

router.get('/revenue', ctrl.getGymRevenue);
router.get('/users', ctrl.getUsers);
router.post('/pay-user', ctrl.payUser);
router.get('/employees', ctrl.getEmployees);
router.post('/employees', ctrl.createEmployee);
router.get('/withdrawal-requests', ctrl.getWithdrawalRequests);
router.put('/withdrawal-requests/:id/approve', ctrl.approveWithdrawal);
router.put('/withdrawal-requests/:id/reject', ctrl.rejectWithdrawal);
router.post('/notifications', ctrl.sendNotification);
router.get('/notifications', ctrl.getNotifications);
router.put('/notifications/:id/read', async (req, res) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  await prisma.notification.update({ where: { id: parseInt(req.params.id) }, data: { isRead: true } });
  res.json({ success: true });
});

module.exports = router;