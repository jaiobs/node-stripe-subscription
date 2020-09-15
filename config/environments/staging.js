module.exports = {
  logging: {
    appenders: {
      app: {
        type: 'dateFile',
        filename: 'logs/staging',
        pattern: '.yyyy-MM-dd.log',
        compress: true,
        alwaysIncludePattern: true,
      },
      consoleAppender: { type: 'console' },
    },
    categories: {
      default: { appenders: ['app', 'consoleAppender'], level: 'debug' },
    },
  },
};
