import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import nodemailer from "nodemailer";
import crypto from "node:crypto";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const verificationToken = crypto.randomUUID();

async function register(req, res, next) {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (user !== null) {
      throw HttpError(409, "User already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { d: "identicon" });

    await transport.sendMail({
      to: email,
      from: "turasova1986@gmail.com",
      subject: "Welcome to PhoneBook",
      html: `To confirm you registration please click on the <a href="http://localhost:3000/users/verify/${verificationToken}">Link</a>`,
      text: `To confirm you registration please open the link http://localhost:3000/users/verify/${verificationToken}`,
    });

    const newUser = await User.create({
      ...req.body,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
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

    if (user.verify === false) {
      throw HttpError(401, "Your account is not verified");
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    const newUser = await User.findByIdAndUpdate(
      user._id,
      { token },
      { new: true }
    );

    res.send({
      token,
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res) {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
}

async function verify(req, res, next) {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

async function resendVerifyEmail(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(400, "Missing required field email");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    await transport.sendMail({
      to: email,
      from: "turasova1986@gmail.com",
      subject: "Welcome to PhoneBook",
      html: `To confirm you registration please click on the <a href="http://localhost:3000/users/verify/${verificationToken}">Link</a>`,
      text: `To confirm you registration please open the link http://localhost:3000/users/verify/${verificationToken}`,
    });

    res.send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}

export default { register, login, logout, current, verify, resendVerifyEmail };
