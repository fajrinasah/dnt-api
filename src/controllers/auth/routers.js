import { Router } from "express";
import * as authControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post("/login", authControllers.login);

export default router;
