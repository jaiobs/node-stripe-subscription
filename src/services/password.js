const bcrypt = require('bcrypt');

exports.bcryptPassword = async (password, callback) => {
  const salt = await bcrypt.genSalt(15);
  const encPassword = await bcrypt.hash(password, salt);
  callback(encPassword);
};
