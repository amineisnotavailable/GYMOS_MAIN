const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/sports', async (req, res) => {
  try {
    const sports = await prisma.sport.findMany();
    res.json(sports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/cards', async (req, res) => {
  try {
    const cards = await prisma.mockCard.findMany({ select: { id: true, cardNumber: true, holderName: true, balance: true } });
    res.json(cards);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;