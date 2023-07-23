import { Router } from "express";

import { verifyRole } from "../../middlewares/index.js";
import * as cashierControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post("/", verifyRole, cashierControllers.addCashier);

/*------------------------------------------------------------
PATCH
-------------------------------------------------------------*/
router.patch("/edit/email", verifyRole, cashierControllers.editEmailCashier);

export default router;
