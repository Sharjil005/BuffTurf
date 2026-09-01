import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import turfRoutes from './turf.routes';
import bookingRoutes from './booking.routes';
import favoriteRoutes from './favorite.routes';
import ownerRoutes from './owner.routes';
import adminRoutes from './admin.routes';
import notificationRoutes from './notification.routes';

const router = Router();
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/turfs', turfRoutes);
router.use('/bookings', bookingRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/owner', ownerRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

export default router;