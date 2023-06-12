import { Request, Response, query } from 'express';
import { amenitiesFindAll } from '../../services/amenities';

export const getAllAmenities = async (req: Request, res: Response) => {
  try {
    const amenities = await amenitiesFindAll();
    res.json(amenities);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
