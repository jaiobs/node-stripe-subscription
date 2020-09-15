const Helper = require('../../helpers/helper');
const { User } = require('../../../src/models');
const UserFactory = require('../../factories/user.factory');

const helper = new Helper();

const AUTH_ENDPOINT = '/api/auth';

beforeAll((done) => {
  helper.server(done);
  // avoid jest open handle error
});
afterAll((done) => {
  helper.close(done);
  // avoid jest open handle error
});

let testUser;

/**
 * @test {authRoutes.js}
 */
describe(`${AUTH_ENDPOINT}`, () => {
  const REGISTER_ENDPOINT = `${AUTH_ENDPOINT}/register`;
  const LOGIN_ENDPOINT = `${AUTH_ENDPOINT}/login`;
  const FORGOT_PASSWORD_ENDPOINT = `${AUTH_ENDPOINT}/forgot_password`;
  let RESET_PASSWORD_EMAIL_EP = `${AUTH_ENDPOINT}/reset_password_email`;
  const VERIFY_BY_EMAIL = `${AUTH_ENDPOINT}/verify_email`;
  describe(`POST ${REGISTER_ENDPOINT}`, () => {
    beforeAll(async () => {
      await User.sync({ force: true });
      testUser = await User.create(UserFactory.generate());
    });

    describe('Create with status 201', () => {
      it('should return the user', async () => {
        const res = await helper.apiServer.post(REGISTER_ENDPOINT).send(UserFactory.generate());
        const { status, body } = res;
        expect(status).toEqual(201);
        expect(body).toHaveProperty('user');
      });
    });

    describe('Error with status 400 & 422', () => {
      it('should return an error if email is already take', async () => {
        const res = await helper.apiServer
          .post(REGISTER_ENDPOINT)
          .send(UserFactory.generate({ email: testUser.email }));
        const { status, body } = res;
        expect(status).toEqual(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual('Email already exist');
      });

      it('should return an error if email is not provided', async () => {
        const res = await helper.apiServer
          .post(REGISTER_ENDPOINT)
          .send(UserFactory.generate({ email: '' }));
        const { status, body } = res;
        expect(status).toEqual(400);
        expect(body).toHaveProperty('message');
        expect(body.message.name).toEqual('ValidationError');
        expect(body.message.details[0].email).toEqual('"email" is not allowed to be empty');
      });

      it('should return an error if password is not provided', async () => {
        const res = await helper.apiServer
          .post(REGISTER_ENDPOINT)
          .send(UserFactory.generate({ password: '' }));
        const { status, body } = res;
        expect(status).toEqual(400);
        expect(body).toHaveProperty('message');
        expect(body.message.name).toEqual('ValidationError');
        expect(body.message.details[0].password).toEqual('"password" is not allowed to be empty');
      });

      it('should return an error if email is not a valid email', async () => {
        const res = await helper.apiServer
          .post(REGISTER_ENDPOINT)
          .send(UserFactory.generate({ email: 'test@test' }));
        const { status, body } = res;
        expect(status).toEqual(400);
        expect(body).toHaveProperty('message');
        expect(body.message.name).toEqual('ValidationError');
        expect(body.message.details[0].email).toEqual('"email" must be a valid email');
      });

      it('should return an error if password is not a good enough', async () => {
        const res = await helper.apiServer
          .post(REGISTER_ENDPOINT)
          .send(UserFactory.generate({ password: 'pass' }));
        const { status, body } = res;
        expect(status).toEqual(400);
        expect(body).toHaveProperty('message');
        expect(body.message.name).toEqual('ValidationError');
        expect(body.message.details[0].password).toEqual(
          '"password" length must be at least 8 characters long',
        );
      });
    });
  });
  describe(`POST ${LOGIN_ENDPOINT}`, () => {
    beforeAll(async () => {
      await User.sync({ force: true });
      testUser = await User.create(UserFactory.generate());
    });

    describe('Login with status 200', () => {
      it('should return the JWT token', async () => {
        const loginUser = await User.create(UserFactory.generate({ isVerified: true }));
        const res = await helper.apiServer.post(LOGIN_ENDPOINT).send({
          email: loginUser.email,
          password: 'password1',
        });
        const { status, body } = res;
        expect(status).toEqual(200);
        expect(body).toHaveProperty('token');
      });
    });

    describe('Error with status 400 & 404', () => {
      it('should return an error if email/password is not available', async () => {
        const res = await helper.apiServer.post(LOGIN_ENDPOINT).send({
          email: testUser.email,
        });
        const { status, body } = res;
        expect(status).toEqual(400);
        expect(body).toHaveProperty('message');
        expect(body.message.name).toEqual('ValidationError');
        expect(body.message.details[0].password).toEqual('"password" is required');
      });

      it('should return an error if email is not a verified', async () => {
        const res = await helper.apiServer.post(LOGIN_ENDPOINT).send({
          email: testUser.email,
          password: 'password1',
        });
        const { status, body } = res;
        expect(status).toEqual(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual('User is not verified');
      });

      it('should return an error if email is not found on db', async () => {
        const res = await helper.apiServer.post(LOGIN_ENDPOINT).send({
          email: 'test@test.com',
          password: 'password1',
        });
        const { status, body } = res;
        expect(status).toEqual(404);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual('User not found');
      });
    });
  });
  describe(`POST ${FORGOT_PASSWORD_ENDPOINT}`, () => {
    beforeAll(async () => {
      await User.sync({ force: true });
      testUser = await User.create(UserFactory.generate({ isVerified: true }));
    });

    describe('Forgot Password with status 200', () => {
      it('should return the success message', async () => {
        const res = await helper.apiServer.post(FORGOT_PASSWORD_ENDPOINT).send({
          email: testUser.email,
        });
        const { status, body } = res;
        expect(status).toEqual(200);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual('Reset password email sent successfully');
      });
    });

    describe('Error with status 400 & 404', () => {
      it('should return an error if email is empty', async () => {
        const res = await helper.apiServer.post(FORGOT_PASSWORD_ENDPOINT).send({
          email: '',
        });
        const { status, body } = res;
        expect(status).toEqual(400);
        expect(body).toHaveProperty('message');
        expect(body.message.name).toEqual('ValidationError');
        expect(body.message.details[0].email).toEqual('"email" is not allowed to be empty');
      });

      it('should return an error if email is not found on db', async () => {
        const res = await helper.apiServer.post(FORGOT_PASSWORD_ENDPOINT).send({
          email: 'test@test.com',
        });
        const { status, body } = res;
        expect(status).toEqual(404);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual("Email doesn't exist");
      });
    });
  });
  describe(`POST ${RESET_PASSWORD_EMAIL_EP}`, () => {
    beforeAll(async () => {
      await User.sync({ force: true });
      testUser = await User.create(UserFactory.generate({ isVerified: true }));
      await helper.apiServer.post(FORGOT_PASSWORD_ENDPOINT).send({
        email: testUser.email,
      });
      testUser = await User.getBy({ email: testUser.email });
      RESET_PASSWORD_EMAIL_EP = `${RESET_PASSWORD_EMAIL_EP}/${testUser.resetPasswordToken}`;
    });
    describe('Error with status 400 & 404', () => {
      it('should return an error if password is empty', async () => {
        const res = await helper.apiServer.post(RESET_PASSWORD_EMAIL_EP).send({
          password: '',
        });
        const { status, body } = res;
        expect(status).toEqual(400);
        expect(body).toHaveProperty('message');
        expect(body.message.name).toEqual('ValidationError');
        expect(body.message.details[0].password).toEqual('"password" is not allowed to be empty');
      });

      it('should return an error if token is invalid', async () => {
        const res = await helper.apiServer.post(`${RESET_PASSWORD_EMAIL_EP}123`).send({
          password: 'passpass',
        });
        const { status, body } = res;
        expect(status).toEqual(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual('Invalid Token');
      });
    });
    describe('Reset Password with status 200', () => {
      it('should return the success message', async () => {
        const res = await helper.apiServer.post(RESET_PASSWORD_EMAIL_EP).send({
          password: 'password2',
        });
        const { status, body } = res;
        expect(status).toEqual(200);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual('Password updated Successfully.');
      });
    });
  });
  describe(`POST ${VERIFY_BY_EMAIL}`, () => {
    beforeAll(async () => {
      await User.sync({ force: true });
      testUser = await User.create(UserFactory.generate());
    });
    describe('Verified Successfully with 200', () => {
      it('should return the success message', async () => {
        const res = await helper.apiServer.post(`${VERIFY_BY_EMAIL}/${testUser.registrationToken}`);
        const { status, body } = res;
        expect(status).toEqual(200);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual('User verified Successfully.');
      });
    });
    describe('Error with status 400 & 404', () => {
      it('should return an error if token is invalid', async () => {
        const res = await helper.apiServer.post(
          `${VERIFY_BY_EMAIL}/${testUser.registrationToken}123`,
        );
        const { status, body } = res;
        expect(status).toEqual(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual('Invalid Token');
      });
      it('should return an error if token is not available', async () => {
        const res = await helper.apiServer.post(VERIFY_BY_EMAIL);
        const { status, body } = res;
        expect(status).toEqual(404);
        expect(body).toHaveProperty('message');
        expect(body.message).toEqual('API not found');
      });
    });
  });
});
