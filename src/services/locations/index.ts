import AppError, { ErrorProps } from '../../error/AppError';
import QueryString from 'qs';
import db from '../../database/bd';
import {
  LocationFindAll,
  LocationResponse,
  LocationSearchAddressResponse,
  LocationsAllFree,
  LocationsResponse,
  SearchLocationsParams
} from '../../models/locations';
export const locationFindAll = async ({ guest, limit, page, query }: LocationFindAll): Promise<LocationsResponse> => {
  const maxGuestCapacity = guest !== undefined ? Number(guest) : 0;

  try {
    if (query) {
      const offset = (Number(page) - 1) * Number(limit);

      const locations = await db('avantio.accommodations')
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

      if (locations) {
        const currentPage = page ? Number(page) : 1;

        return {
          data: locations,
          currentPage,
          limit: Number(limit)
        };
      } else {
        throw new AppError('Não há acomodações');
      }
    } else {
      const offset = (Number(page) - 1) * Number(limit);

      const locations: LocationResponse[] = await db('avantio.accommodations')
        .leftJoin('system.buildings as buildings', 'accommodations.building_yogha', '=', 'buildings.id')
        .where('avantio.accommodations.max_guest_capacity', '>=', Number(maxGuestCapacity))
        .select(['avantio.accommodations.id as idAccommodation', '*'])
        .limit(Number(limit))
        .offset(offset);

      if (locations) {
        const currentPage = page ? Number(page) : 1;

        return {
          data: locations,
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
}: SearchLocationsParams): Promise<LocationSearchAddressResponse[]> => {
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
export const locationsFindAllFree = async ({
  checkIn,
  checkOut,
  limit,
  query,
  page
}: LocationsAllFree): Promise<LocationsResponse | ErrorProps> => {
  try {
    const offset = (Number(page) - 1) * Number(limit);

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
      .offset(offset)

      .limit(Number(limit));

    if (locations.length > 0) {
      const currentPage = page ? Number(page) : 1;

      return {
        data: locations,
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
