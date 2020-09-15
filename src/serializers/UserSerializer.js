const UserSerializer = {
  serialize(user) {
    const { id, name, email } = user;
    return {
      id,
      name,
      email,
    };
  },
};

module.exports = UserSerializer;
