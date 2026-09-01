import { Router } from 'express';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { createReviewSchema } from '../validators/review.validator';
import * as reviewController from '../controllers/review.controller';

const router = Router({ mergeParams: true });

router.get('/', asyncHandler(reviewController.getTurfReviews));
router.post('/', protect, validate(createReviewSchema), asyncHandler(reviewController.createReview));

export default router;