import express from 'express';
import { getAllAmenities } from '../controllers/amenities';
import { verifyJWT } from '../utils/jwt';

const router = express.Router();

router.get('/', getAllAmenities);

export default router;
