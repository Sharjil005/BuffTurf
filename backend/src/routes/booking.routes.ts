import { Router } from 'express';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { createBookingSchema } from '../validators/booking.validator';
import * as bookingController from '../controllers/booking.controller';

const router = Router();

router.use(protect);

router.post('/', validate(createBookingSchema), asyncHandler(bookingController.createBooking));
router.get('/', asyncHandler(bookingController.getMyBookings));
router.get('/:id', asyncHandler(bookingController.getBooking));
router.patch('/:id/cancel', asyncHandler(bookingController.cancelBooking));

export default router;