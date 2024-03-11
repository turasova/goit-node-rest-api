import User from "../models/user.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";
import * as crypto from "node:crypto";

const avatarsDir = path.join(process.cwd(), "public/avatars");

async function uploadAvatar(req, res, next) {
  const { _id } = req.user;

  if (!req.user) {
    throw HttpError(401, { message: "Not authorized" });
  }
  const { path: tmpUpload, originalname } = req.file;

  await Jimp.read(tmpUpload)
    .then((avatar) => {
      return avatar.resize(250, 250).quality(60).write(tmpUpload);
    })
    .catch((error) => {
      throw error;
    });

  const prefix = crypto.randomUUID();
  const fileName = `${prefix}_${_id}_${originalname}`;
  const publicUpload = path.join(avatarsDir, fileName);

  await fs.rename(tmpUpload, publicUpload);
  const avatarURL = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
}

export default uploadAvatar;
