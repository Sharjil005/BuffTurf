import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import turfRoutes from './turf.routes';
import bookingRoutes from './booking.routes';

const router = Router();
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/turfs', turfRoutes);
router.use('/bookings', bookingRoutes);

export default router;