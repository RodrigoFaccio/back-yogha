import express from 'express';
import {
  getAccommodationsAutocompleteController,
  getAccommodationsController,
  getAccommodationsLiveController,
  getCalendarAccommodation,
  getUniqueAccommodation,
  getValueAccommodations
} from '../controllers/accommodations';
import { verifyJWT } from '../utils/jwt';

const router = express.Router();

router.post('/', getAccommodationsController);
router.get('/searchAddressAutocomplete', getAccommodationsAutocompleteController);
router.post('/accommodationsFree', getAccommodationsLiveController);
router.get('/:id', getUniqueAccommodation);
router.get('/notFreeCalendar/:id', getCalendarAccommodation);
router.post('/accommodationValeu/:id', getValueAccommodations);

export default router;
