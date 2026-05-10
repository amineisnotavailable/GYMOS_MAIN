const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/roleCheck');
const ctrl = require('../controllers/walletController');

router.get('/mywallet', auth, ctrl.getMyWallet);
router.post('/pay', auth, role('ATHLETE'), ctrl.payWithCard);

// Request a withdrawal
router.post('/withdraw', auth, async (req, res) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
  const wallet = await walletService.getOrCreateWallet(req.user.id);
  if (wallet.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });
  const request = await prisma.withdrawalRequest.create({
    data: { userId: req.user.id, amount, status: 'PENDING' }
  });
  res.status(201).json(request);
});

// Get own withdrawal requests
router.get('/withdrawals', auth, async (req, res) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const requests = await prisma.withdrawalRequest.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(requests);
});

module.exports = router;