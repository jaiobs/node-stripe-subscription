/* eslint-disable no-console */
module.exports = {
  [process.env.NODE_ENV]: {
    username: process.env.POSTGRES_USERNAME,
    database: process.env.DB_NAME,
    port: 5433,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    logging: console.log,
  },
};
