import { Router } from "express";

import {
  verifyRole,
  productImageDestroyer,
  verifyUser,
} from "../../middlewares/index.js";
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
router.get("/:productId", verifyUser, productControllers.getProduct);

/*------------------------------------------------------------
PATCH
-------------------------------------------------------------*/
router.patch(
  "/edit/image/:productId",
  verifyRole,
  productImageDestroyer,
  uploader.single("file"),
  productControllers.editProductImage
);

router.patch(
  "/edit/info/:productId",
  verifyRole,
  productControllers.editProductInfo
);

router.patch(
  "/edit/status/:productId",
  verifyRole,
  productControllers.editProductStatus
);

export default router;
