import { prisma } from '../config/db';
import { ApiError } from '../utils/ApiError';

export async function createNotification(userId: number, type: string, message: string) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      message,
    },
  });
}

export async function getUserNotifications(userId: number, limit = 30) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getUnreadNotificationCount(userId: number) {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}

export async function markNotificationAsRead(notificationId: number, userId: number) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  if (notification.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to access this notification');
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function markAllNotificationsAsRead(userId: number) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: { isRead: true },
  });
}

export async function deleteNotification(notificationId: number, userId: number) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  if (notification.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to delete this notification');
  }

  return prisma.notification.delete({
    where: { id: notificationId },
  });
}
