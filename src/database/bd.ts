import knex, { Knex } from 'knex';
const db = knex({
  client: 'pg',
  connection: {
    user: 'yogha',
    host: 'yogha.cdfv1v16vhkd.us-east-1.rds.amazonaws.com',
    database: 'yogha',
    password: '8Nk8kDbsFNfuJ2NF',
    port: 5432,
    connectionTimeoutMillis: 2000
  }
});
export default db;
