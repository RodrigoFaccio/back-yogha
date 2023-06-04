import express from 'express';
import {
  getLocationsController,
  getLocationAutocompleteController,
  getLocationLiveController,
  getUniqueLocation
} from '../controllers/locations';
import { verifyJWT } from '../utils/jwt';

const router = express.Router();

router.get('/', verifyJWT, getLocationsController);
router.get('/searchAddressAutocomplete', verifyJWT, getLocationAutocompleteController);
router.get('/reservation', verifyJWT, getLocationLiveController);
router.get('/:id', verifyJWT, getUniqueLocation);

export default router;
