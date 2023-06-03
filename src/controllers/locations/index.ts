import { Request, Response, query } from 'express';
import {
  getLocationsDataBase,
  getSearchAutocomplete,
  getVerifyLocationLive,
  getUniqueLocationApi
} from '../../services/locations';

export const getLocationsController = async (req: Request, res: Response) => {
  const { limit, query, guest } = req.query;

  try {
    const locations = await getLocationsDataBase(limit, query, guest);

    res.json(locations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};

export const getLocationAutocompleteController = async (req: Request, res: Response) => {
  const { query, limit } = req.query;

  try {
    const locations = await getSearchAutocomplete(query, limit);
    res.json(locations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
export const getLocationLiveController = async (req: Request, res: Response) => {
  const { query, limit, checkIn, checkOut } = req.query;

  try {
    const locations = await getVerifyLocationLive(query, limit, checkIn, checkOut);
    res.json(locations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
export const getUniqueLocation = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const locations = await getUniqueLocationApi(Number(id));
    res.json(locations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
