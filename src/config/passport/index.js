const passport = require('passport');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getBy({ id }, (err, user) => {
    done(err, user);
  });
});

const findUser = (arg) => {
  const user = User.getBy(arg);

  return user;
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: process.env.JWT_SECRET,
  ignoreExpiration: true,
};

passport.use(
  new JWTStrategy(opts, (jwtPayload, done) => {
    findUser({ id: jwtPayload.sub })
      .then((user) => done(null, user))
      .catch((err) => done(err, false));
  }),
);
/**
 * Login Required middleware.
 */
exports.isAuthenticated = passport.authenticate('jwt', { session: false });
