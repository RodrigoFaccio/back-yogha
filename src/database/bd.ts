import knex, { Knex } from 'knex';
const db = knex({
  client: 'pg',
  connection: {
    user: 'yogha',
    host: 'yogha-development.cdfv1v16vhkd.us-east-1.rds.amazonaws.com',
    database: 'yogha',
    password: 'nfPw6S8uTKMex_z8',
    port: 5432,
    connectionTimeoutMillis: 2000
  }
});
export default db;
