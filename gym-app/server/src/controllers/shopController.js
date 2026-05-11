const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const walletService = require('../services/walletService');
const revenueService = require('../services/revenueService');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Get all subscription plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany();
    res.json(plans);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Buy a product or subscription
exports.buyItem = async (req, res) => {
  try {
    const { productId, planId, quantity } = req.body;
    const userId = req.user.id;

    // Get athlete profile
    const profile = await prisma.athleteProfile.findUnique({ where: { userId } });
    if (!profile) return res.status(400).json({ error: 'Athlete profile not found' });

    let totalAmount = 0;
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: 0,
      },
    });

    if (productId && !planId) {
      // Buy product
      const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
      if (!product) return res.status(400).json({ error: 'Product not found' });
      const qty = quantity || 1;
      totalAmount = product.price * qty;

      // Check wallet
      const wallet = await walletService.getOrCreateWallet(userId);
      if (wallet.balance < totalAmount) return res.status(400).json({ error: 'Insufficient balance' });

      // Deduct wallet
      await prisma.wallet.update({
        where: { userId },
        data: { balance: wallet.balance - totalAmount },
      });

      // Create order item
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: qty,
          price: product.price,
        },
      });

      // Update revenue
      await revenueService.addRevenue(totalAmount);
    } else if (planId && !productId) {
      // Buy subscription
      const plan = await prisma.subscriptionPlan.findUnique({ where: { id: parseInt(planId) } });
      if (!plan) return res.status(400).json({ error: 'Plan not found' });

      totalAmount = plan.price;

      // Check wallet
      const wallet = await walletService.getOrCreateWallet(userId);
      if (wallet.balance < totalAmount) return res.status(400).json({ error: 'Insufficient balance' });

      // Deduct wallet
      await prisma.wallet.update({
        where: { userId },
        data: { balance: wallet.balance - totalAmount },
      });

      // Create athlete subscription (deactivate old, activate new)
      await prisma.athleteSubscription.updateMany({
        where: { athleteId: profile.id, endDate: null },
        data: { endDate: new Date() },
      });

      await prisma.athleteSubscription.create({
        data: {
          athleteId: profile.id,
          planId: plan.id,
          remainingSessions: plan.sessionCount,
        },
      });

      // Create order item
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          planId: plan.id,
          quantity: 1,
          price: plan.price,
        },
      });

      // Update revenue
      await revenueService.addRevenue(totalAmount);
    } else {
      return res.status(400).json({ error: 'Select either a product or a subscription plan' });
    }

    // Update order total
    await prisma.order.update({
      where: { id: order.id },
      data: { totalAmount },
    });

    res.status(201).json({ message: 'Purchase successful', totalAmount });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Get sales history (for employees/owners)
exports.getSales = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: { select: { name: true } },
            plan: { select: { name: true } },
          },
        },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
};