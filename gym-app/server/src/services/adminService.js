const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, email: true, role: true, firstName: true, lastName: true, phone: true, createdAt: true }
  });
};

exports.getAllEmployees = async () => {
  return prisma.employee.findMany();
};

exports.createEmployee = async (data) => {
  return prisma.employee.create({ data });
};

exports.fireEmployee = async (id) => {
  return prisma.employee.update({ where: { id }, data: { firedAt: new Date() } });
};

exports.getAllUserIds = async () => {
  const users = await prisma.user.findMany({ select: { id: true } });
  return users.map(u => u.id);
};

exports.generateReports = async () => {
  // Example: count of users by role, number of sessions, attendance
  const totalUsers = await prisma.user.count();
  const coaches = await prisma.user.count({ where: { role: 'COACH' } });
  const athletes = await prisma.user.count({ where: { role: 'ATHLETE' } });
  const admins = await prisma.user.count({ where: { role: 'ADMIN' } });
  return { totalUsers, coaches, athletes, admins };
};