import { v2 as cloudinary } from "cloudinary";

import { User } from "../../models/user.js";
import * as config from "../../configs/index.js";

export async function photoProfileDestroyer(req, res, next) {
  try {
    const { uuid } = req.user;

    // CHECK CURRENT PHOTO PROFILE
    const user = await User?.findOne({
      where: { uuid },
    });

    // DELETE CURRENT PHOTO PROFILE FROM CLOUDINARY (IF ANY)
    const currentPhotoProfile = user?.dataValues?.photo_profile;

    if (currentPhotoProfile !== null) {
      // GET IMAGE'S PUBLIC ID FROM PROVIDED URL
      const splitted = currentPhotoProfile.split("/");
      const imgName = splitted[8].split(".").splice(0, 1);
      const publicId = `${splitted[7]}/${imgName[0]}`;

      // CLOUDINARY CONFIG
      cloudinary.config({
        cloud_name: config.CLOUDINARY_CLOUD_NAME,
        api_key: config.CLOUDINARY_API_KEY,
        api_secret: config.CLOUDINARY_API_SECRET,
      });

      cloudinary.uploader.destroy(publicId, function (result) {
        console.log(result);
        console.log(
          `Old image with public ID ${publicId} was destroyed successfully`
        );
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}
