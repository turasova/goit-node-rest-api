import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

async function register(req, res, next) {
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (user !== null) {
      throw HttpError(409, "User already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: normalizedEmail,
      password: passwordHash,
    });

    res.status(201).send("Registration successfully");
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log(email);
      throw HttpError(401, "Email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password");
      throw HttpError(401, "Email or password is incorrect");
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    const newUser = await User.findByIdAndUpdate(
      user.id,
      { token },
      { new: true }
    );

    res.send(newUser);
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const { id } = req.user;
    await User.findByIdAndUpdate(id, { token: "" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res) {
  const { name } = req.user;

  res.send({
    name,
  });
}

export default { register, login, logout, current };
