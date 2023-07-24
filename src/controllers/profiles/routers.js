import { Router } from "express";

import { verifyUser, photoProfileDestroyer } from "../../middlewares/index.js";
import * as profilesControllers from "./index.js";
import {
  createUploader,
  createCloudinaryStorage,
} from "../../helpers/imageUploader.js";

const router = Router();
const storage = createCloudinaryStorage("users");
const uploader = createUploader(storage);

/*------------------------------------------------------------
PATCH
-------------------------------------------------------------*/
router.patch(
  "/photo-profile",
  verifyUser,
  photoProfileDestroyer,
  uploader.single("file"),
  profilesControllers.changePhotoProfile
);

export default router;
