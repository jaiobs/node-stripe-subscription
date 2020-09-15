const jwt = require('jsonwebtoken');

exports.token = (user) => {
  return jwt.sign(
    {
      iss: 'amega-rms', // change issuer name
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
    },
    process.env.JWT_SECRET,
  );
};
