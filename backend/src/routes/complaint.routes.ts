import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { createComplaintSchema, updateComplaintStatusSchema } from '../validators/complaint.validator';
import * as complaintController from '../controllers/complaint.controller';

const router = Router();

router.post('/', protect, validate(createComplaintSchema), asyncHandler(complaintController.createComplaint));
router.get('/mine', protect, asyncHandler(complaintController.getMyComplaints));
router.get('/owner', protect, authorize('TURF_OWNER'), asyncHandler(complaintController.getOwnerComplaints));
router.get('/admin', protect, authorize('ADMIN'), asyncHandler(complaintController.getAllComplaints));
router.patch(
  '/:id/status',
  protect,
  authorize('TURF_OWNER', 'ADMIN'),
  validate(updateComplaintStatusSchema),
  asyncHandler(complaintController.updateStatus)
);

export default router;
