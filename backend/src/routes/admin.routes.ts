import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as adminController from '../controllers/adminDashboard.controller';

const router = Router();
router.use(protect, authorize('ADMIN'));

router.get('/stats', asyncHandler(adminController.getPlatformStats));
router.get('/users', asyncHandler(adminController.getAllUsers));
router.patch('/users/:id/role', asyncHandler(adminController.updateUserRole));
router.get('/turfs', asyncHandler(adminController.getAllTurfs));
router.patch('/turfs/:id/status', asyncHandler(adminController.updateTurfStatus));
router.get('/bookings', asyncHandler(adminController.getAllBookings));

export default router;