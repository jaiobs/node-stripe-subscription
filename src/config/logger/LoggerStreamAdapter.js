const LoggerStreamAdapter = {
  toStream(logger) {
    return {
      write(message) {
        if (process.env.NODE_ENV === 'development') {
          logger.info(message.slice(0, -1));
        }
      },
    };
  },
};

module.exports = LoggerStreamAdapter;
