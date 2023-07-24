import { Router } from "express";

import { verifyRole } from "../../middlewares/index.js";
import * as categoriesControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
GET
-------------------------------------------------------------*/
router.get("/", verifyRole, categoriesControllers.getCategories);

export default router;
