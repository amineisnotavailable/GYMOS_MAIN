const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.createProfile = async (userId, data) => {
  return prisma.athleteProfile.create({
    data: {
      userId,
      maturity: data.maturity || 'ADULT',
      parentContact: data.parentContact || null,
      level: data.level || 'AMATEUR',
      competitionValidity: data.competitionValidity || false,
    }
  })
}

exports.assignCoach = async (athleteId, coachId) => {
  return prisma.athleteProfile.update({
    where: { id: athleteId },
    data: { coachId }
  })
}

exports.addSport = async (athleteId, sportId) => {
  return prisma.athleteSport.create({
    data: { athleteId, sportId }
  })
}

// Returns the athlete's profile (auto-creates if missing)
exports.getProfile = async (userId) => {
  let profile = await prisma.athleteProfile.findUnique({
    where: { userId },
    include: {
      sports: { include: { sport: true } },
      coach: true,
      sessions: { include: { sport: true, coach: true } },
      user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } }
    }
  })

  if (profile) return profile

  // Auto-create a default profile
  return prisma.athleteProfile.create({
    data: {
      userId,
      maturity: 'ADULT',
      level: 'AMATEUR',
      competitionValidity: false,
    },
    include: {
      sports: { include: { sport: true } },
      coach: true,
      sessions: { include: { sport: true, coach: true } },
      user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } }
    }
  })
}

// Get all athlete profiles (for coach dropdowns)
exports.getAllAthletes = async () => {
  return prisma.athleteProfile.findMany({
    include: {
      user: { select: { id: true, email: true, firstName: true, lastName: true } },
      coach: { select: { id: true, firstName: true, lastName: true } }
    }
  })
}

// Get sessions for a specific athlete (by athlete profile id)
exports.getMySessions = async (athleteId) => {
  return prisma.session.findMany({
    where: { athleteId },
    include: {
      sport: true,
      coach: { select: { firstName: true, lastName: true } }
    },
    orderBy: { dateTime: 'asc' }
  })
}