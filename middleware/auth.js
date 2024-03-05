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
    const { id } = jwt.decode(token, JWT_SECRET);
    const user = await User.findById(id);

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

  // const authorizationHeader = req.headers.authorization;

  // if (typeof authorizationHeader === "undefined") {
  //   return res.status(401).send({ message: "Invalid token" });
  // }

  // const [bearer, token] = authorizationHeader.split(" ", 2);

  // if (bearer !== "Bearer") {
  //   return res.status(401).send({ message: "Invalid token" });
  // }

  // jwt.verify(token, JWT_SECRET, async (err, decode) => {
  //   if (err) {
  //     if (err.name === "TokenExpiredError") {
  //       return res.status(401).send({ message: "Token expired" });
  //     }

  //     return res.status(401).send({ message: "Invalid token" });
  //   }

  //   const user = await User.findById(decode.id);

  //   if (user === null) {
  //     return res.status(401).send({ message: "Invalid token" });
  //   }

  //   if (user.token !== token) {
  //     return res.status(401).send({ message: "Invalid token" });
  //   }

  //   req.user = {
  //     id: decode.id,
  //     name: decode.name,
  //   };

  //   next();
  // });
}

export default auth;
