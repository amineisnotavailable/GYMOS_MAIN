const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/roleCheck');
const ctrl = require('../controllers/athleteController');

router.use(auth, role('ATHLETE'));

router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);
router.get('/sessions', ctrl.getMySessions);
router.get('/notifications', ctrl.getNotifications);
router.put('/notifications/:id/read', ctrl.markNotificationRead);
router.post('/sports', ctrl.addSport);

module.exports = router;