import { UserResponse } from '../../models/Users';
import { QueryResult } from 'pg';
import AppError, { ErrorProps } from '../../error/AppError';
import QueryString from 'qs';
import db from '../../database/bd';
import { LocationResponse, LocationSearchAddressResponse } from '../../models/locations';
import { convertAddressLatLgn } from '../../utils/convertAddress';
export const getLocationsDataBase = async (
  limit: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined,
  query: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined,
  guest: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined
): Promise<any[]> => {
  try {
    if (query) {
      const locations = await db('avantio.accommodations')
        .select(['avantio.accommodations.id as idAccommodation', '*'])
        .leftJoin('system.buildings as buildings', 'accommodations.building_yogha', '=', 'buildings.id')
        .whereRaw('LOWER(buildings.town) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(buildings.name) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(buildings.area) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(buildings.address) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(buildings.street_number) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .where('avantio.accommodations.max_guest_capacity', '>=', Number(guest))

        .limit(Number(limit));
      if (locations) {
        return locations;
      } else {
        throw new AppError('Não a acomodações');
      }
    } else {
      const locations = await db('avantio.accommodations')
        .leftJoin('system.buildings as buildings', 'accommodations.building_yogha', '=', 'buildings.id')
        .where('avantio.accommodations.max_guest_capacity', '>=', Number(guest))

        .select(['avantio.accommodations.id as idAccommodation', '*'])
        .limit(Number(limit));

      if (locations) {
        return locations;
      } else {
        throw new AppError('Não a acomodações');
      }
    }
  } catch (error) {
    throw new AppError('Falta de parâmetros');
  }
};

export const getSearchAutocomplete = async (
  query: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined,
  limit: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined
): Promise<LocationSearchAddressResponse[]> => {
  try {
    const locations = await db('system.buildings')
      .select(['id', 'name', 'town', 'area', 'address', 'street_number'])
      .whereRaw('LOWER(town) LIKE ?', [`%${String(query).toLowerCase()}%`])
      .orWhereRaw('LOWER(name) LIKE ?', [`%${String(query).toLowerCase()}%`])
      .orWhereRaw('LOWER(address) LIKE ?', [`%${String(query).toLowerCase()}%`])
      .orWhereRaw('LOWER(street_number) LIKE ?', [`%${String(query).toLowerCase()}%`])
      .limit(Number(limit));
    const newLocations = locations.map((item) => {
      return {
        ...item,
        id: Number(item.id)
      };
    });

    if (newLocations) {
      return newLocations;
    } else {
      throw new AppError('Não a acomodações');
    }
  } catch (error) {
    throw new AppError('Falta de parâmetros');
  }
};
export const getVerifyLocationLive = async (
  query: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined,
  limit: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined,
  checkIn: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined,
  checkOut: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[] | undefined
): Promise<LocationSearchAddressResponse[] | ErrorProps> => {
  try {
    const locations = await db('avantio.accommodations')
      .select(['avantio.accommodations.*', 'system.buildings.*'])
      .leftJoin('avantio.booking', 'avantio.accommodations.code', '=', 'avantio.booking.accommodation_code')
      .leftJoin('system.buildings', 'accommodations.building_yogha', '=', 'system.buildings.id')
      .whereNull('avantio.booking.accommodation_code')
      .orWhere(function () {
        this.where('avantio.booking.arrival_date', '>=', String(checkIn)).orWhere(
          'booking.departure_date',
          '<=',
          String(checkOut)
        );
      })
      .limit(Number(limit));
    if (locations.length > 0) {
      return locations;
    } else {
      return {
        statusCode: 400,
        message: 'Acomodação não encontrada'
      };
    }
  } catch (error) {
    throw new AppError('Falta de parâmetros');
  }
};

export const getUniqueLocationApi = async (id: number): Promise<LocationSearchAddressResponse[] | ErrorProps> => {
  try {
    const locations = await db('avantio.accommodations')
      .select(['avantio.accommodations.id as idAccommodation', '*'])

      .leftJoin('system.buildings as buildings', 'accommodations.building_yogha', '=', 'buildings.id')
      .where('avantio.accommodations.id', '=', id);

    if (locations.length > 0) {
      return locations;
    } else {
      return {
        statusCode: 400,
        message: 'Acomodação não encontrada'
      };
    }
  } catch (error) {
    throw new AppError('Verifique os parametros');
  }
};
