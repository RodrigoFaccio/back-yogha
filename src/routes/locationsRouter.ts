import express from 'express';
import {
  getLocationsController,
  getLocationAutocompleteController,
  getLocationLiveController,
  getUniqueLocation
} from '../controllers/locations';

const router = express.Router();

router.get('/', getLocationsController);
router.get('/searchAddressAutocomplete', getLocationAutocompleteController);
router.get('/reservation', getLocationLiveController);
router.get('/:id', getUniqueLocation);

export default router;
