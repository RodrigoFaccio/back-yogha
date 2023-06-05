import { Request, Response, query } from 'express';
import {
  accommodationsFindAll,
  getSearchAutocomplete,
  accommodationsFindAllFree,
  getUniqueAccommodationApi
} from '../../services/accommodations';
import AppError from '../../error/AppError';

export const getAccommodationsController = async (req: Request, res: Response) => {
  const { limit, query, guest, page } = req.query;

  try {
    const accommodations = await accommodationsFindAll({ guest, limit, page, query });

    res.json(accommodations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};

export const getAccommodationsAutocompleteController = async (req: Request, res: Response) => {
  const { query, limit } = req.query;

  try {
    const accommodations = await getSearchAutocomplete({ limit, query });
    res.json(accommodations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
export const getAccommodationsLiveController = async (req: Request, res: Response) => {
  const { query, limit, checkIn, checkOut, page } = req.query;

  try {
    const accommodations = await accommodationsFindAllFree({ checkIn, checkOut, limit, query, page });
    res.json(accommodations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
export const getUniqueAccommodation= async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError('Id é obrigatório');
  }

  try {
    const accommodations = await getUniqueAccommodationApi(Number(id));
    res.json(accommodations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
