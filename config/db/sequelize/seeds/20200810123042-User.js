const { bcryptPassword } = require('../../../../src/services/password');

module.exports = {
  up: async (queryInterface) => {
    const testUsers = [];
    let password = '';
    await bcryptPassword('Password1!', (encPassword) => {
      password = encPassword;
    });
    testUsers.push({
      name: 'super admin',
      email: 'superadmin@yopmail.com',
      password,
      userType: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    testUsers.push({
      name: 'test user',
      email: 'example@yopmail.com',
      password,
      userType: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      line1: '510 Townsend St',
      postal_code: '98140',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
    });
    return queryInterface.bulkInsert('Users', testUsers, {});
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
