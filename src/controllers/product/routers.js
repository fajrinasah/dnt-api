import { Router } from "express";

import { verifyRole, productImageDestroyer } from "../../middlewares/index.js";
import * as productControllers from "./index.js";
import {
  createUploader,
  createCloudinaryStorage,
} from "../../helpers/imageUploader.js";

const router = Router();
const storage = createCloudinaryStorage("products");
const uploader = createUploader(storage);

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post(
  "/",
  verifyRole,
  uploader.single("file"),
  productControllers.addProduct
);

/*------------------------------------------------------------
GET
-------------------------------------------------------------*/

/*------------------------------------------------------------
PATCH
-------------------------------------------------------------*/

export default router;