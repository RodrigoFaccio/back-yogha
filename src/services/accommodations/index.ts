import AppError, { ErrorProps } from '../../error/AppError';
import QueryString from 'qs';
import db from '../../database/bd';
import {
  AccommodationFindAll,
  AccommodationResponse,
  AccommodationsResponse,
  AccommodationSearchAddressResponse,
  SearchAccommodationsParams,
  AccommodationsAllFree,
  DataParamsStay
} from '../../models/locations';
import { checkCache, setCache } from '../../redis/redisCache';
import axios from 'axios';
export const accommodationsFindAll = async ({
  guest,
  limit,
  page,
  query
}: AccommodationFindAll): Promise<AccommodationsResponse> => {
  const maxGuestCapacity = guest !== undefined ? Number(guest) : 0;
  const cacheKey = `accommodations:${JSON.stringify({ guest, limit, page, query })}`;
  const cacheData = await checkCache(cacheKey);
  if (cacheData) {
    const parsedData = JSON.parse(cacheData);

    return {
      data: parsedData.data,
      currentPage: parsedData.currentPage,
      limit: parsedData.limit,
      cacheExists: true
    };
  }

  try {
    if (query) {
      const offset = (Number(page) - 1) * Number(limit);
      const accommodations: AccommodationResponse[] = await db('avantio.accommodations')
        .select(['avantio.accommodations.id as idAccommodation', '*'])
        .leftJoin('system.buildings as buildings', 'accommodations.building_yogha', '=', 'buildings.id')
        .whereRaw('LOWER(buildings.town) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(buildings.name) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(buildings.area) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(buildings.address) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(buildings.street_number) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .where('avantio.accommodations.max_guest_capacity', '>=', Number(maxGuestCapacity))
        .offset(offset)

        .limit(Number(limit));

      if (accommodations) {
        const currentPage = page ? Number(page) : 1;
        setCache(
          cacheKey,
          JSON.stringify({
            data: accommodations,
            currentPage,
            limit: Number(limit)
          }),
          60
        );
        return {
          data: accommodations,
          currentPage,
          limit: Number(limit),
          cacheExists: false
        };
      } else {
        throw new AppError('Não há acomodações');
      }
    } else {
      const cacheKey = `accommodations:${JSON.stringify({ guest, limit, page })}`;
      const cacheData = await checkCache(cacheKey);
      if (cacheData) {
        const parsedData = JSON.parse(cacheData);

        return {
          data: parsedData.data,
          currentPage: parsedData.currentPage,
          limit: parsedData.limit,
          cacheExists: true
        };
      }
      const offset = (Number(page) - 1) * Number(limit);

      const accommodations: AccommodationResponse[] = await db('avantio.accommodations')
        .leftJoin('system.buildings as buildings', 'accommodations.building_yogha', '=', 'buildings.id')
        .where('avantio.accommodations.max_guest_capacity', '>=', Number(maxGuestCapacity))
        .select(['avantio.accommodations.id as idAccommodation', '*'])
        .limit(Number(limit))
        .offset(offset);

      if (accommodations) {
        const currentPage = page ? Number(page) : 1;
        setCache(
          cacheKey,
          JSON.stringify({
            data: accommodations,
            currentPage,
            limit: Number(limit)
          }),
          10
        );

        return {
          data: accommodations,
          currentPage,
          limit: Number(limit),
          cacheExists: false
        };
      } else {
        throw new AppError('Não há acomodações');
      }
    }
  } catch {
    throw new AppError('Não há acomodações');
  }
};

export const getSearchAutocomplete = async ({
  limit,
  query
}: SearchAccommodationsParams): Promise<AccommodationSearchAddressResponse[]> => {
  try {
    const accommodations = await db('system.buildings')
      .select(['id', 'name', 'town', 'area', 'address', 'street_number'])
      .whereRaw('LOWER(town) LIKE ?', [`%${String(query).toLowerCase()}%`])
      .orWhereRaw('LOWER(name) LIKE ?', [`%${String(query).toLowerCase()}%`])
      .orWhereRaw('LOWER(address) LIKE ?', [`%${String(query).toLowerCase()}%`])
      .orWhereRaw('LOWER(street_number) LIKE ?', [`%${String(query).toLowerCase()}%`])
      .limit(Number(limit));
    const newAccommodations = accommodations.map((item) => {
      return {
        ...item,
        id: Number(item.id)
      };
    });

    if (newAccommodations) {
      return newAccommodations;
    } else {
      throw new AppError('Não a acomodações');
    }
  } catch (error) {
    throw new AppError('Falta de parâmetros');
  }
};
export const accommodationsFindAllFree = async (data: DataParamsStay): Promise<any | ErrorProps> => {
  const cacheKey = `accommodations:${JSON.stringify(data)}`;
  console.log(cacheKey);
  const cacheData = await checkCache(cacheKey);
  if (cacheData) {
    const parsedData = JSON.parse(cacheData);

    return {
      data: parsedData.data,
      currentPage: parsedData.currentPage,
      limit: parsedData.limit,
      cacheExists: true
    };
  }
  try {
    const username = '4b6a509f';
    const password = 'ec9b4a62';

    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    const responseStay = await axios.post('https://yogha.stays.net/external/v1/booking/search-listings', data, {
      headers: {
        Authorization: authHeader
      }
    });
    setCache(
      cacheKey,
      JSON.stringify({
        data: responseStay.data
      }),
      60
    );
    return responseStay.data;
  } catch (error) {
    throw new AppError('Verifique os parametros');
  }
};

export const getUniqueAccommodationApi = async (
  id: number
): Promise<AccommodationSearchAddressResponse[] | ErrorProps> => {
  try {
    const accommodations = await db('avantio.accommodations')
      .select(['avantio.accommodations.id as idAccommodation', '*'])

      .leftJoin('system.buildings as buildings', 'accommodations.building_yogha', '=', 'buildings.id')
      .where('avantio.accommodations.id', '=', id);

    if (accommodations.length > 0) {
      return accommodations;
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
