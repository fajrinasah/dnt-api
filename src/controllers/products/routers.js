import { Router } from "express";

import { verifyUser } from "../../middlewares/index.js";
import * as productsControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
GET
-------------------------------------------------------------*/
router.get("/", verifyUser, productsControllers.getAllProducts);

export default router;
