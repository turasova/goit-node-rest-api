import "dotenv/config";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const { JWT_SECRET } = process.env;

async function auth(req, res, next) {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }
  try {
    const { _id } = jwt.decode(token, JWT_SECRET);
    const user = await User.findById(_id);

    if (!user || !user.token) {
      return res.status(401).send({ message: "Invalid token" });
    }

    if (token !== user.token) {
      return res.status(401).send({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export default auth;
