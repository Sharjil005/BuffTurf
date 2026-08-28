import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as ownerController from '../controllers/ownerDashboard.controller';

const router = Router();
router.use(protect, authorize('TURF_OWNER'));

router.get('/dashboard', asyncHandler(ownerController.getDashboardStats));
router.get('/bookings', asyncHandler(ownerController.getOwnerBookings));
router.patch('/bookings/:id/complete', asyncHandler(ownerController.markBookingCompleted));

export default router;