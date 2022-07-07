const userModel = require("../models/user");

const getUserByEmail = (email) => {
  return userModel.findOne({ where: { email } });
};

const createUser = (name, email, password) => {
  return userModel.create({
    name,
    email,
    password,
  });
};

module.exports = { getUserByEmail, createUser };
