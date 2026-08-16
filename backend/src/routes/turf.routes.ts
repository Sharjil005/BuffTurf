import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { upload } from '../middleware/upload';
import { createTurfSchema, updateTurfSchema } from '../validators/turf.validator';
import * as turfController from '../controllers/turf.controller';

const router = Router();

// Static routes MUST come before "/:id" — otherwise Express treats
// "sports"/"mine" as if they were an :id value.
router.get('/sports', asyncHandler(turfController.listSports));
router.get('/facilities', asyncHandler(turfController.listFacilities));
router.get('/mine', protect, authorize('TURF_OWNER'), asyncHandler(turfController.getMyTurfs));

router.post(
  '/',
  protect,
  authorize('TURF_OWNER'),
  validate(createTurfSchema),
  asyncHandler(turfController.createTurf)
);

router.get('/:id', asyncHandler(turfController.getTurf));

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