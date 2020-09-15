/**
 * Create fake user for testing
 */

const faker = require('faker');
const BaseFactory = require('./base.factory');

class UserFactory extends BaseFactory {
  /**
   * Create a user
   *
   * @public
   * @param {Object} attrs of user
   * @returns {Object} a fake user
   */
  // eslint-disable-next-line class-methods-use-this
  generate(attrs) {
    return {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      password: 'password1',
      ...attrs,
    };
  }
}

module.exports = new UserFactory();
