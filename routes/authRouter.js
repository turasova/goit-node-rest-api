import express from "express";
import validateBody from "../helpers/validateBody.js";
import controllers from "../controllers/authControllers.js";
import { loginSchema, registerSchema } from "../schemas/authSchema.js";
import auth from "../middleware/auth.js";

const authRouter = express.Router();
const jsonParse = express.json();

authRouter.post(
  "/register",
  jsonParse,
  validateBody(registerSchema),
  controllers.register
);
authRouter.post(
  "/login",
  jsonParse,
  validateBody(loginSchema),
  controllers.login
);
authRouter.post("/logout", auth, controllers.logout);
authRouter.get("/current", auth, controllers.current);

export default authRouter;
