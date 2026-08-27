import { Router } from 'express';
import { protect } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as favoriteController from '../controllers/favorite.controller';

const router = Router();
router.use(protect);

router.get('/', asyncHandler(favoriteController.getMyFavorites));
router.post('/:turfId', asyncHandler(favoriteController.addFavorite));
router.delete('/:turfId', asyncHandler(favoriteController.removeFavorite));

export default router;