import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as analyticsController from '../controllers/analytics.controller';

const router = Router();

router.get('/owner', protect, authorize('TURF_OWNER'), asyncHandler(analyticsController.getOwnerAnalytics));
router.get('/admin', protect, authorize('ADMIN'), asyncHandler(analyticsController.getAdminAnalytics));
router.get('/export/bookings', protect, asyncHandler(analyticsController.exportBookingsCSV));

export default router;
