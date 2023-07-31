/*-------------------------------------------------------*/
// IMPORT FROM DEPENDENCIES
/*-------------------------------------------------------*/
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import chalk from "chalk";

/*-------------------------------------------------------*/
// IMPORT FROM LOCAL (SRC)
/*-------------------------------------------------------*/
import * as middlewares from "./src/middlewares/index.js";
import * as helpers from "./src/helpers/index.js";
import * as routers from "./src/controllers/routers/index.js";

/*-------------------------------------------------------*/
// DEPENDENCIES CONFIGURATIONS
/*-------------------------------------------------------*/
const app = express();
dotenv.config();

/*-------------------------------------------------------*/
// USAGE CONFIGURATIONS
/*-------------------------------------------------------*/
app.use(bodyParser.json());
app.use(cors({ exposedHeaders: "Authorization" }));
app.use(middlewares.requestLogger);

/*-------------------------------------------------------*/
// TEST CONNECTION
/*-------------------------------------------------------*/
helpers.connect.withRedis();
helpers.connect.withSequelize();

/*-------------------------------------------------------*/
// DEFINE ROOT ROUTE
/*-------------------------------------------------------*/
app.get("/", (req, res) => {
  res.status(200).send("<h1> Connected to dnt API successfully. </h1>");
});

/*-------------------------------------------------------*/
// USE ROUTERS
/*-------------------------------------------------------*/
app.use("/api/auth", routers.authRouters);
app.use("/api/profiles", routers.profilesRouters);

app.use("/api/cashier", routers.cashierRouters);
app.use("/api/cashiers", routers.cashiersRouters);

app.use("/api/category", routers.categoryRouters);
app.use("/api/categories", routers.categoriesRouters);

app.use("/api/product", routers.productRouters);
app.use("/api/products", routers.productsRouters);

app.use("/api/transaction", routers.transactionsRouters);

app.use("/api/reports", routers.reportsRouters);

/*-------------------------------------------------------*/
// USE ERROR HANDLER
/*-------------------------------------------------------*/
app.use(middlewares.errorHandler);

/*-------------------------------------------------------*/
// LISTEN TO PORT
/*-------------------------------------------------------*/
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(chalk.bgGreenBright("Server running") + ` on port ${PORT}`)
);
