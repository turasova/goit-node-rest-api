import express from "express";
import uploadAvatar from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const userRouter = express.Router();

userRouter.patch("/avatars", auth, upload.single("avatar"), uploadAvatar);

export default userRouter;
