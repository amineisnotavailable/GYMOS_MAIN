const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  if (req.user.role !== 'COACH') return next(); // only for coaches
  try {
    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: req.user.id },
      select: { isApproved: true },
    });
    if (!coachProfile || !coachProfile.isApproved) {
      return res.status(403).json({ error: 'Your account is pending approval.' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};