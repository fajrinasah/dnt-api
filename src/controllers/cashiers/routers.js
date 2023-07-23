import { Router } from "express";

import { verifyRole } from "../../middlewares/index.js";
import * as cashiersControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
GET
-------------------------------------------------------------*/
router.get("/", verifyRole, cashiersControllers.getAllCashiers);

export default router;
