const { validationResult } = require("express-validator");
require("dotenv").config();

const userServices = require("../services/user");
const encryptServices = require("../services/encrypt");
const tokenServices = require("../services/token");

const invalidFields = require("../errors/invalidFields");
const badDevNoCoffe = require("../errors/badDevNoCoffe");
const errorWithResponse = require("../errors/errorWithResponse");

const signUpController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new invalidFields());

  const { name, email, password } = req.body;

  try {
    const existingUser = await userServices.getUserByEmail(email);

    if (existingUser)
      return next(
        new errorWithResponse(
          "Usuario já cadastrado, por favor insira outro!",
          422
        )
      );
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  let hashedPassword;

  try {
    hashedPassword = await encryptServices.onEncryptPassword(password);
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  let createdUser;
  try {
    createdUser = await userServices.createUser(
      name,
      email,
      hashedPassword,
    );
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  let token;

  try {
    token = tokenServices.getTokenWithInformations({
      id: createdUser.id,
      name,
      email,
    });
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  res.status(201).json(token);
};

const signInController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new invalidFields());

  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await userServices.getUserByEmail(email);

    if (!existingUser) return next(new invalidFields());
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  try {
    const isValid = await encryptServices.onComparePassword(
      password,
      existingUser.password
    );

    if (!isValid) return next(new invalidFields());
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  let token;

  try {
    token = tokenServices.getTokenWithInformations({
      id: existingUser.id,
      email,
      name: existingUser.name,
    });
  } catch (error) {
    console.error(error);
    return next(new badDevNoCoffe());
  }

  res.status(200).json(token);
};

module.exports = { signUpController, signInController };