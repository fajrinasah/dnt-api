import { Router } from "express";

import { verifyUser } from "../../middlewares/index.js";
import * as categoriesControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
GET
-------------------------------------------------------------*/
router.get("/", verifyUser, categoriesControllers.getCategories);
router.get(
  "/product/:productId",
  verifyUser,
  categoriesControllers.getProductCategories
);

export default router;
