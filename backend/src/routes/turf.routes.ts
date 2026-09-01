import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { upload } from '../middleware/upload';
import { createTurfSchema, updateTurfSchema } from '../validators/turf.validator';
import * as turfController from '../controllers/turf.controller';
import { createTimeSlotSchema, updateTimeSlotSchema } from '../validators/timeSlot.validator';
import * as timeSlotController from '../controllers/timeSlot.controller';
import * as reviewController from '../controllers/review.controller';
import { createReviewSchema } from '../validators/review.validator';

const router = Router();

// Fixed-path routes MUST come before "/:id" — otherwise Express
// would treat "sports" / "facilities" / "mine" as an :id value.
router.get('/', asyncHandler(turfController.getTurfs));
router.get('/sports', asyncHandler(turfController.listSports));
router.get('/facilities', asyncHandler(turfController.listFacilities));
router.get('/mine', protect, authorize('TURF_OWNER'), asyncHandler(turfController.getMyTurfs));

router.get('/:id/reviews', asyncHandler(reviewController.getTurfReviews));
router.post(
  '/:id/reviews',
  protect,
  validate(createReviewSchema),
  asyncHandler(reviewController.createReview)
);

router.post(
  '/',
  protect,
  authorize('TURF_OWNER'),
  validate(createTurfSchema),
  asyncHandler(turfController.createTurf)
);

router.get('/:id', asyncHandler(turfController.getTurf));

router.get('/:id/slots', asyncHandler(timeSlotController.getTurfSlots));

router.get('/:id/availability', asyncHandler(timeSlotController.getAvailability));

router.post(
  '/:id/slots',
  protect,
  authorize('TURF_OWNER'),
  validate(createTimeSlotSchema),
  asyncHandler(timeSlotController.createTimeSlot)
);

router.patch(
  '/:id/slots/:slotId',
  protect,
  authorize('TURF_OWNER', 'ADMIN'),
  validate(updateTimeSlotSchema),
  asyncHandler(timeSlotController.updateTimeSlot)
);

router.delete(
  '/:id/slots/:slotId',
  protect,
  authorize('TURF_OWNER', 'ADMIN'),
  asyncHandler(timeSlotController.deleteTimeSlot)
);

router.put(
  '/:id',
  protect,
  authorize('TURF_OWNER', 'ADMIN'),
  validate(updateTurfSchema),
  asyncHandler(turfController.updateTurf)
);

router.delete(
  '/:id',
  protect,
  authorize('TURF_OWNER', 'ADMIN'),
  asyncHandler(turfController.deleteTurf)
);

router.post(
  '/:id/images',
  protect,
  authorize('TURF_OWNER'),
  upload.single('image'),
  asyncHandler(turfController.uploadTurfImage)
);

router.delete(
  '/:id/images/:imageId',
  protect,
  authorize('TURF_OWNER', 'ADMIN'),
  asyncHandler(turfController.deleteTurfImage)
);


export default router;