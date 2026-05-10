const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getMyAthletes = async (coachId) => {
  return prisma.athleteProfile.findMany({
    where: { coachId },
    include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } } }
  });
};

exports.createSession = async (data) => {
  return prisma.session.create({
    data: {
      coachId: data.coachId,
      athleteId: data.athleteId,
      sportId: data.sportId,
      dateTime: new Date(data.dateTime),
      duration: parseInt(data.duration) || 60,
      location: data.location,
      notes: data.notes,
    }
  });
};

exports.getMySchedule = async (coachId) => {
  return prisma.session.findMany({
    where: { coachId },
    include: { athlete: { include: { user: { select: { firstName: true, lastName: true } } } }, sport: true }
  });
};

exports.createProfile = async (userId, data) => {
  return prisma.coachProfile.create({
    data: {
      userId,
      specialty: data.specialty || null,
    }
  });
};

// NEW: get profile by user ID
exports.getProfileByUserId = async (userId) => {
  return prisma.coachProfile.findUnique({
    where: { userId },
  });
};