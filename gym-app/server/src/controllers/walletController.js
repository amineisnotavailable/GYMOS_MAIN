const walletService = require('../services/walletService');
const revenueService = require('../services/revenueService');

exports.getMyWallet = async (req, res) => {
  try {
    const wallet = await walletService.getOrCreateWallet(req.user.id);
    res.json(wallet);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Athlete pays with a mock card (creates wallet + transfers to gym)
exports.payWithCard = async (req, res) => {
  try {
    const { cardId } = req.body;
    const card = await prisma.mockCard.findUnique({ where: { id: parseInt(cardId) } });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    if (card.balance < 10) return res.status(400).json({ error: 'Insufficient funds' });

    // Deduct from card
    await prisma.mockCard.update({ where: { id: card.id }, data: { balance: card.balance - 10 } });

    // Create wallet for athlete if not exists
    const wallet = await walletService.getOrCreateWallet(req.user.id);
    await walletService.topUp(req.user.id, 10);  // athlete gets 10 credits

    // Gym revenue increases
    await revenueService.addRevenue(10);

    res.json({ message: 'Payment successful', wallet });
  } catch (err) { res.status(500).json({ error: err.message }); }
};