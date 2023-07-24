import { Router } from "express";

import { verifyRole } from "../../middlewares/index.js";
import * as categoryControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post("/", verifyRole, categoryControllers.addCategory);

/*------------------------------------------------------------
PATCH
-------------------------------------------------------------*/
router.patch("/:categoryId", verifyRole, categoryControllers.editCategory);

/*------------------------------------------------------------
DELETE
-------------------------------------------------------------*/
router.delete("/:categoryId", verifyRole, categoryControllers.deleteCategory);

export default router;
