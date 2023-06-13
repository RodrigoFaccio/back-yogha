import { Request, Response, query } from 'express';
import {
  accommodationsFindAll,
  getSearchAutocomplete,
  accommodationsFindAllFree,
  getUniqueAccommodationApi,
  getValueAccommodationsService
} from '../../services/accommodations';
import AppError from '../../error/AppError';
import { DataParamsStay } from '../../models/locations';

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
  const {
    from,
    to,
    guests,
    rooms,
    amenities,
    cities,
    countries,
    inventory,
    limit,
    listingId,
    properties,
    regions,
    skip,
    sort,
    states
  } = req.body;
  const data: DataParamsStay = {
    from,
    to,
    guests,
    rooms,
    amenities,
    cities,
    countries,
    inventory,
    limit,
    listingId,
    properties,
    regions,
    skip,
    sort,
    states
  };
  try {
    const accommodations = await accommodationsFindAllFree(data);
    res.json(accommodations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
export const getUniqueAccommodation = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError('Id é obrigatório');
  }

  try {
    const accommodations = await getUniqueAccommodationApi(id);
    res.json(accommodations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
export const getValueAccommodations = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.body;

  if (!id) {
    throw new AppError('Id é obrigatório');
  }

  try {
    const accommodations = await getValueAccommodationsService(id, checkIn, checkOut);
    res.json(accommodations);
  } catch (error: any) {
    res.status(error.statusCode).json({
      message: error.message
    });
  }
};
