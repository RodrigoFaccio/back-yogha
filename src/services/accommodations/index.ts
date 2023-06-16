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
import moment from 'moment';
import {
  formatReturnAccommodationCheckInCheckOut,
  formatReturnAccommodationNotCheckInCheckOut,
  getDatesBetween,
  sumValuesByInterval
} from '../../utils/accommodationsUtils';
const username = '4b6a509f';
const password = 'ec9b4a62';
const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

export const accommodationsFindAll = async ({
  guest,
  limit,
  page,
  query,
  checkIn,
  checkOut
}: AccommodationFindAll): Promise<AccommodationsResponse> => {
  const maxGuestCapacity = guest !== undefined ? Number(guest) : 0;
  const cacheKey = `accommodations:${JSON.stringify({ guest, limit, page, query, checkIn, checkOut })}`;
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
      const accommodations: any[] = await db('avantio.accommodations')
        .leftJoin('system.buildings as buildings', 'accommodations.building_yogha', '=', 'buildings.id')
        .leftJoin(
          'properties.accommodations_emphasys',
          'properties.accommodations_emphasys.accommodation_id',
          '=',
          'avantio.accommodations.id'
        )
        .leftJoin('properties.rate_plans', 'properties.rate_plans.accommodation_id', '=', 'avantio.accommodations.id')
        .select(['avantio.accommodations.id as idAccommodation', 'avantio.accommodations.ref_stays as refStayId', '*'])
        .whereRaw('LOWER(buildings.town) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(buildings.name) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(buildings.area) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(buildings.address) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(avantio.accommodations.accommodation) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .orWhereRaw('LOWER(buildings.street_number) LIKE ?', [`%${String(query).toLowerCase()}%`])
        .where('avantio.accommodations.max_guest_capacity', '>=', Number(maxGuestCapacity))

        .offset(offset)
        .limit(Number(limit));

      const newAccommodations = accommodations.filter((item) => item.refStaysAccommodation !== null);

      if (checkIn || checkOut) {
        const accommodationsValue = sumValuesByInterval(checkIn, checkOut, newAccommodations);
        const accommodationsValueCheckInCheckOut = formatReturnAccommodationCheckInCheckOut(accommodationsValue);

        if (accommodationsValueCheckInCheckOut) {
          const currentPage = page ? Number(page) : 1;
          setCache(
            cacheKey,
            JSON.stringify({
              data: accommodationsValueCheckInCheckOut,
              currentPage,
              limit: Number(limit),
              total: accommodationsValueCheckInCheckOut.length
            }),
            60
          );

          return {
            data: accommodationsValueCheckInCheckOut,
            currentPage,
            limit: Number(limit),
            cacheExists: false,
            total: accommodationsValueCheckInCheckOut.length
          };
        }
      }
      const accommodation = formatReturnAccommodationNotCheckInCheckOut(newAccommodations);

      if (accommodation) {
        const currentPage = page ? Number(page) : 1;
        setCache(
          cacheKey,
          JSON.stringify({
            data: accommodation,
            currentPage,
            limit: Number(limit),
            total: accommodation.length
          }),
          10
        );
        return {
          data: accommodation,
          currentPage,
          limit: Number(limit),
          cacheExists: false,
          total: accommodation.length
        };
      } else {
        throw new AppError('Não há acomodações');
      }
    } else {
      const cacheKey = `accommodations:${JSON.stringify({ guest, limit, page, checkIn, checkOut })}`;
      const cacheData = await checkCache(cacheKey);
      if (cacheData) {
        const parsedData = JSON.parse(cacheData);

        return {
          data: parsedData.data,
          currentPage: parsedData.currentPage,
          limit: parsedData.limit,
          cacheExists: true,
          total: parsedData.total.length
        };
      }
      const offset = (Number(page) - 1) * Number(limit);
      const accommodations: any[] = await db('avantio.accommodations')
        .leftJoin('system.buildings as buildings', 'accommodations.building_yogha', '=', 'buildings.id')

        .leftJoin(
          'properties.accommodations_emphasys',
          'properties.accommodations_emphasys.accommodation_id',
          '=',
          'avantio.accommodations.id'
        )
        .leftJoin('properties.rate_plans', 'properties.rate_plans.accommodation_id', '=', 'avantio.accommodations.id')
        .where('avantio.accommodations.max_guest_capacity', '>=', Number(maxGuestCapacity))
        .whereNotNull('avantio.accommodations.ref_stays') // Filter to include only non-null values

        .select(['avantio.accommodations.id as idAccommodation', 'avantio.accommodations.ref_stays as refStayId', '*'])
        .limit(Number(limit))

        .offset(offset);
      if (checkIn || checkOut) {
        const resultado = sumValuesByInterval(checkIn, checkOut, accommodations);
        const accommodationsValueCheckInCheckOut = formatReturnAccommodationCheckInCheckOut(resultado);

        if (accommodationsValueCheckInCheckOut) {
          const currentPage = page ? Number(page) : 1;
          setCache(
            cacheKey,
            JSON.stringify({
              data: accommodationsValueCheckInCheckOut,
              currentPage,
              limit: Number(limit),
              total: accommodationsValueCheckInCheckOut.length
            }),
            10
          );

          return {
            data: accommodationsValueCheckInCheckOut,
            currentPage,
            limit: Number(limit),
            cacheExists: false,
            total: accommodationsValueCheckInCheckOut.length
          };
        }
      }
      const accommodationsValueCheckInCheckOut = formatReturnAccommodationNotCheckInCheckOut(accommodations);

      if (accommodationsValueCheckInCheckOut) {
        const currentPage = page ? Number(page) : 1;
        setCache(
          cacheKey,
          JSON.stringify({
            data: accommodationsValueCheckInCheckOut,
            currentPage,
            limit: Number(limit),
            total: accommodationsValueCheckInCheckOut.length
          }),
          10
        );

        return {
          data: accommodationsValueCheckInCheckOut,
          currentPage,
          limit: Number(limit),
          cacheExists: false,
          total: accommodationsValueCheckInCheckOut.length
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

export const getUniqueAccommodationApi = async (id: string): Promise<any | ErrorProps> => {
  try {
    const accommodations = await axios.get(`https://yogha.stays.net/external/v1/content/listings/${id}`, {
      headers: {
        Authorization: authHeader
      }
    });

    return accommodations.data;
  } catch (error) {
    throw new AppError('Verifique os parametros');
  }
};

export const getValueAccommodationsService = async (
  id: string,
  checkIn: string,
  checkOut: string
): Promise<any | ErrorProps> => {
  try {
    const accommodations = await db('properties.rate_plans')
      .select('*')
      .leftJoin('avantio.accommodations', 'properties.rate_plans.accommodation_id', '=', 'avantio.accommodations.id')
      .where('properties.rate_plans.accommodation_id', '=', id);

    function somarValoresPorIntervalo(dataInicio: string, dataFim: string) {
      let soma = 0;
      let numDias = 0;
      const datas = Object.keys(accommodations[0]).filter((key) =>
        moment(key).isBetween(dataInicio, dataFim, null, '[]')
      );

      for (let i = 0; i < datas.length; i++) {
        const valor = parseFloat(accommodations[0][datas[i]]);
        if (!isNaN(valor)) {
          soma += valor;
        }
      }

      numDias = moment(dataFim).diff(dataInicio, 'days') + 1;

      return {
        soma,
        numDias
      };
    }
    const total = somarValoresPorIntervalo(checkIn, checkOut);

    return {
      ...accommodations[0],
      sumDailyValues: total.soma,
      averagePerNight: total.soma / total.numDias
    };
  } catch (error) {
    throw new AppError('Verifique os parametros');
  }
};
export const getCheckCalendarAccommodation = async (id: string): Promise<any | ErrorProps> => {
  const currentDate = moment();
  const checkIn = currentDate.format('YYYY-MM-DD');
  const newDate = currentDate.add(1, 'year');

  const checkOut = newDate.format('YYYY-MM-DD');
  console.log(checkIn, checkOut);
  try {
    const accommodations: any = await axios.get(`https://yogha.stays.net/external/v1/calendar/listing/${id}`, {
      headers: {
        Authorization: authHeader
      },
      params: {
        from: checkIn,
        to: checkOut
      }
    });

    const formateAccommodations = accommodations.data.filter((item: any) => {
      if (item.avail === 0) {
        return {
          date: item.date,
          resevado: true
        };
      }
    });

    const NewArr = formateAccommodations.map((item: any) => {
      return {
        date: item.date,
        resevado: true
      };
    });
    if (NewArr.length <= 0) {
      return {
        message: 'Essa acomodação não tem nenhuma reserva'
      };
    } else {
      return NewArr;
    }
  } catch (error) {
    throw new AppError('Verifique os parametros');
  }
};
