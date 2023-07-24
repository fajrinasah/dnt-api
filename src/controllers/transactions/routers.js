import { Router } from "express";

import { verifyUser } from "../../middlewares/index.js";
import * as transactionsControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post("/", verifyUser, transactionsControllers.addTransaction);

export default router;
