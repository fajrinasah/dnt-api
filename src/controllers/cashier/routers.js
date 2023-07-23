import { Router } from "express";

import { verifyRole } from "../../middlewares/index.js";
import * as cashierControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
GET
-------------------------------------------------------------*/
router.get("/:username", verifyRole, cashierControllers.getCashier);

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post("/", verifyRole, cashierControllers.addCashier);

/*------------------------------------------------------------
PATCH
-------------------------------------------------------------*/
router.patch("/edit/email", verifyRole, cashierControllers.editEmailCashier);

/*------------------------------------------------------------
DELETE
-------------------------------------------------------------*/
router.delete("/:username", verifyRole, cashierControllers.inactivateCashier);

export default router;
