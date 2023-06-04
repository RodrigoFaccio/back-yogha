import { Request, Response, query } from 'express';
import {
  locationFindAll,
  getSearchAutocomplete,
  locationsFindAllFree,
  getUniqueLocationApi
} from '../../services/locations';
import AppError from '../../error/AppError';

export const getLocationsController = async (req: Request, res: Response) => {
  const { limit, query, guest, page } = req.query;

  try {
    const locations = await locationFindAll({ guest, limit, page, query });

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
    const locations = await getSearchAutocomplete({ limit, query });
    res.json(locations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
export const getLocationLiveController = async (req: Request, res: Response) => {
  const { query, limit, checkIn, checkOut, page } = req.query;

  try {
    const locations = await locationsFindAllFree({ checkIn, checkOut, limit, query, page });
    res.json(locations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
export const getUniqueLocation = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError('Id é obrigatório');
  }

  try {
    const locations = await getUniqueLocationApi(Number(id));
    res.json(locations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
