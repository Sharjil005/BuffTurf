import { api } from './axios';

export interface AppNotification {
  id: number;
  userId: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export async function getMyNotifications(): Promise<AppNotification[]> {
  const res = await api.get('/notifications');
  return res.data.notifications;
}

export async function getUnreadCount(): Promise<number> {
  const res = await api.get('/notifications/unread-count');
  return res.data.unreadCount;
}

export async function markAsRead(notificationId: number): Promise<AppNotification> {
  const res = await api.patch(`/notifications/${notificationId}/read`);
  return res.data.notification;
}

export async function markAllAsRead(): Promise<void> {
  await api.patch('/notifications/read-all');
}

export async function deleteNotification(notificationId: number): Promise<void> {
  await api.delete(`/notifications/${notificationId}`);
}
