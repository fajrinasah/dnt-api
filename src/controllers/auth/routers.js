import { Router } from "express";

import { verifyUser } from "../../middlewares/index.js";
import * as authControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post("/login", authControllers.login);
router.post("/request-otp", authControllers.requestOtp);

/*------------------------------------------------------------
GET
-------------------------------------------------------------*/
router.get("/keep-login", verifyUser, authControllers.keepLogin);

export default router;
