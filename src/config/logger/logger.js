const Log4js = require('log4js');
const config = require('../../../config');

Log4js.configure(config.logging);

const logger = Log4js.getLogger('app');

module.exports = logger;
