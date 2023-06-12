import { UserResponse } from '../../models/Users';
import QueryString from 'qs';

import pool from '../../database/bd';
import { QueryResult } from 'pg';
import bcrypt from 'bcrypt';
import AppError, { ErrorProps } from '../../error/AppError';
import jwt from 'jsonwebtoken';
import knex from 'knex';
import db from '../../database/bd';
import { checkCache, setCache } from '../../redis/redisCache';
import axios from 'axios';
const username = '4b6a509f';
const password = 'ec9b4a62';
const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

export const amenitiesFindAll = async (): Promise<any | ErrorProps> => {
  const cacheKey = `amenities`;
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
    const responseStay = await axios.get('https://yogha.stays.net/external/v1/translation/property-amenities', {
      headers: {
        Authorization: authHeader
      }
    });
    setCache(
      cacheKey,
      JSON.stringify({
        data: responseStay.data
      }),
      300
    );
    console.log(responseStay);
    return responseStay.data;
  } catch (error) {
    throw new AppError('Verifique os parametros');
  }
};
