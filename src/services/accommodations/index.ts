import AppError, { ErrorProps } from '../../error/AppError';
import QueryString from 'qs';
import db from '../../database/bd';
import {
  AccommodationFindAll, AccommodationResponse, AccommodationsResponse,
  AccommodationSearchAddressResponse,
  SearchAccommodationsParams,
  AccommodationsAllFree
} from '../../models/locations';
export const accommodationsFindAll = async ({
  guest,
  limit,
  page,
  query
}: AccommodationFindAll): Promise<AccommodationsResponse> => {
  const maxGuestCapacity = guest !== undefined ? Number(guest) : 0;

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

        return {
          data: accommodations,
          currentPage,
          limit: Number(limit)
        };
      } else {
        throw new AppError('Não há acomodações');
      }
    } else {
      const offset = (Number(page) - 1) * Number(limit);

      const accommodations: AccommodationResponse[] = await db('avantio.accommodations')
        .leftJoin('system.buildings as buildings', 'accommodations.building_yogha', '=', 'buildings.id')
        .where('avantio.accommodations.max_guest_capacity', '>=', Number(maxGuestCapacity))
        .select(['avantio.accommodations.id as idAccommodation', '*'])
        .limit(Number(limit))
        .offset(offset);

      if (accommodations) {
        const currentPage = page ? Number(page) : 1;

        return {
          data: accommodations,
          currentPage,
          limit: Number(limit)
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
export const accommodationsFindAllFree = async ({
  checkIn,
  checkOut,
  limit,
  query,
  page
}: AccommodationsAllFree): Promise<AccommodationsResponse | ErrorProps> => {
  try {
    const offset = (Number(page) - 1) * Number(limit);

    const accommodations = await db('avantio.accommodations')
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
      .offset(offset)

      .limit(Number(limit));

    if (accommodations.length > 0) {
      const currentPage = page ? Number(page) : 1;

      return {
        data: accommodations,
        currentPage,
        limit: Number(limit)
      };
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

export const getUniqueAccommodationApi = async (id: number): Promise<AccommodationSearchAddressResponse[] | ErrorProps> => {
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
