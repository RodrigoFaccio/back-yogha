import express from 'express';
import {
 getAccommodationsAutocompleteController,getAccommodationsController,getAccommodationsLiveController,getUniqueAccommodation
} from '../controllers/accommodations';
import { verifyJWT } from '../utils/jwt';

const router = express.Router();

router.get('/', verifyJWT, getAccommodationsController);
router.get('/searchAddressAutocomplete', getAccommodationsAutocompleteController);
router.get('/reservation', verifyJWT, getAccommodationsLiveController);
router.get('/:id', verifyJWT, getUniqueAccommodation);

export default router;
