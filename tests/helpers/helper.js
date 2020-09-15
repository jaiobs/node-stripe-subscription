const supertest = require('supertest');
const http = require('http');
const { exec } = require('child_process');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

let server;

class Helper {
  constructor(token = '') {
    const createServer = async (done) => {
      await sequelize.drop();
      await sequelize.sync();
      exec(
        `sequelize db:seed --seed 20200804121124-userRoles.js`,
        (seedError, seedStdout, seedStderr) => {
          if (seedError) {
            console.warn(seedError);
          }
          console.warn(`stdout: ${seedStdout}`);
          console.error(`stderr: ${seedStderr}`);
        },
      );
      server = http.createServer(app);
      server.listen(done);
    };

    const hook = (method = 'post') => (args) =>
      supertest(server)[method](args).set('Authorization', `JWT ${token}`);

    const request = {
      post: hook('post'),
      get: hook('get'),
      put: hook('put'),
      delete: hook('delete'),
    };

    const close = (done) => {
      server.close(done);
    };

    this.apiServer = request;
    this.close = close;
    this.server = createServer;
  }
}

module.exports = Helper;
