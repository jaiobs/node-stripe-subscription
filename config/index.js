const path = require('path');

const ENV = process.env.NODE_ENV;

// eslint-disable-next-line import/no-dynamic-require
const envConfig = require(path.join(__dirname, 'environments', ENV));

module.exports = envConfig;
