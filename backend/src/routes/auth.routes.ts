import { Router } from 'express';
import { register, login, logout, me, updateProfile } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { protect } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../validators/user.validator';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.post('/logout', logout);
router.get('/me', protect, asyncHandler(me));
router.patch('/me', protect, validate(updateProfileSchema), asyncHandler(updateProfile));

export default router;