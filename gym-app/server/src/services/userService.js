const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

exports.findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email }, include: { athleteProfile: true, coachProfile: true } });
};

exports.createUser = async (data) => {
  const hashed = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash: hashed,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    },
    include: { athleteProfile: true, coachProfile: true }
  });
};

exports.validatePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};