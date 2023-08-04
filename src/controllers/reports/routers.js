import { Router } from "express";

import { verifyUser } from "../../middlewares/index.js";
import * as reportsControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post("/sales-report", verifyUser, reportsControllers.createSalesReportByDateRange);

/*------------------------------------------------------------
GET
-------------------------------------------------------------*/
router.get("/sales-report", verifyUser, reportsControllers.getSalesAggregateByDay);
router.get("/product-sold", verifyUser, reportsControllers.getProductsSoldForTransaction);

export default router;
