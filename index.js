const chalk = require('chalk');

const app = require('./src/app');

// Error Handling End

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  console.info(
    '%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env'),
  );
  console.info('  Press CTRL-C to stop\n');
});

module.exports = server;
