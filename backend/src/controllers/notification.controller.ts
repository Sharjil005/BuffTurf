import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service';
import { ApiError } from '../utils/ApiError';

export async function getMyNotifications(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const notifications = await notificationService.getUserNotifications(req.user.id);
  res.json({ notifications });
}

export async function getUnreadCount(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const count = await notificationService.getUnreadNotificationCount(req.user.id);
  res.json({ unreadCount: count });
}

export async function markAsRead(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const notificationId = Number(req.params.id);
  if (isNaN(notificationId)) throw new ApiError(400, 'Invalid notification ID');

  const notification = await notificationService.markNotificationAsRead(notificationId, req.user.id);
  res.json({ notification });
}

export async function markAllAsRead(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  await notificationService.markAllNotificationsAsRead(req.user.id);
  res.json({ message: 'All notifications marked as read' });
}

export async function deleteNotification(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, 'Unauthorized');
  const notificationId = Number(req.params.id);
  if (isNaN(notificationId)) throw new ApiError(400, 'Invalid notification ID');

  await notificationService.deleteNotification(notificationId, req.user.id);
  res.json({ message: 'Notification deleted successfully' });
}
