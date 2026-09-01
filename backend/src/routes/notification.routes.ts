import { Router } from 'express';
import { protect } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as notificationController from '../controllers/notification.controller';

const router = Router();

router.get('/', protect, asyncHandler(notificationController.getMyNotifications));
router.get('/unread-count', protect, asyncHandler(notificationController.getUnreadCount));
router.patch('/read-all', protect, asyncHandler(notificationController.markAllAsRead));
router.patch('/:id/read', protect, asyncHandler(notificationController.markAsRead));
router.delete('/:id', protect, asyncHandler(notificationController.deleteNotification));

export default router;
