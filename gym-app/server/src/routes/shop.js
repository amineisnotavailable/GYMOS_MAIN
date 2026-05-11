const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/roleCheck');
const ctrl = require('../controllers/shopController');

// Public (for athlete browsing)
router.get('/products', ctrl.getProducts);
router.get('/plans', ctrl.getPlans);

// Athlete purchases
router.post('/buy', auth, role('ATHLETE'), ctrl.buyItem);

// Sales history (for employees & owners)
router.get('/sales', auth, role('EMPLOYEE', 'OWNER'), ctrl.getSales);

module.exports = router;