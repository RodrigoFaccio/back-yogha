import express from 'express';
import {
  getAccommodationsAutocompleteController,
  getAccommodationsController,
  getAccommodationsLiveController,
  getUniqueAccommodation,
  getValueAccommodations
} from '../controllers/accommodations';
import { verifyJWT } from '../utils/jwt';

const router = express.Router();

router.get('/', getAccommodationsController);
router.get('/searchAddressAutocomplete', getAccommodationsAutocompleteController);
router.post('/accommodationsFree', getAccommodationsLiveController);
router.get('/:id', getUniqueAccommodation);
router.post('/accommodationValeu/:id', getValueAccommodations);

export default router;
