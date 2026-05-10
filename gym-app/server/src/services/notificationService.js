const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createNotification = async (data) => {
  // data: recipientId, senderId, message, type
  return prisma.notification.create({ data });
};

exports.getNotificationsForUser = async (userId) => {
  return prisma.notification.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      sender: {
        select: { id: true, firstName: true, lastName: true, role: true }
      }
    }
  });
};

exports.markAsRead = async (notificationId) => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true }
  });
};
