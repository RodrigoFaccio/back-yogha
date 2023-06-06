import express from 'express';
import {
  getAccommodationsAutocompleteController,
  getAccommodationsController,
  getAccommodationsLiveController,
  getUniqueAccommodation
} from '../controllers/accommodations';
import { verifyJWT } from '../utils/jwt';

const router = express.Router();

router.get('/', getAccommodationsController);
router.get('/searchAddressAutocomplete', getAccommodationsAutocompleteController);
router.post('/bookings', getAccommodationsLiveController);
router.get('/:id', verifyJWT, getUniqueAccommodation);

export default router;
