import { QueryTypes } from "sequelize";

import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import {
  countProductsQueryBuilder,
  productsQueryBuilder,
} from "../../helpers/index.js";
import db from "../../database/index.js";

/*----------------------------------------------------*/
// GET ALL PRODUCT'S DATA (with pagination, filtering, and sorting)
/*----------------------------------------------------*/
export const getAllProducts = async (req, res, next) => {
  try {
    const { page, status, category, name, timesort, pricesort, namesort } =
      req.query;

    // BUILD RAW QUERY TO GET DATA
    const queryData = productsQueryBuilder({
      page,
      status,
      category,
      name,
      timesort,
      pricesort,
      namesort,
    });

    // BUILD RAW QUERY TO COUNT DATA
    const countData = countProductsQueryBuilder({ status, category, name });

    // GET DATA FROM DB
    const products = await db.sequelize.query(queryData, {
      logging: console.log,
      plain: false,
      raw: true,
      nest: true,
      type: QueryTypes.SELECT,
    });

    // CHECK IF THERE'S NO DATA
    if (!products.length)
      throw {
        status: errorStatus.NOT_FOUND_STATUS,
        message: errorMessage.DATA_NOT_FOUND + ": no products data yet",
      };

    // COUNT DATA
    const count = await db.sequelize.query(countData, {
      logging: console.log,
      plain: false,
      raw: true,
      nest: true,
      type: QueryTypes.SELECT,
    });

    // FOR PAGINATION DATA
    const limit = 10;
    const total_pages = Math.ceil(count?.[0]?.total_products / limit);

    // SEND RESPONSE
    res.status(200).json({
      page,
      total_pages,
      total_products: count?.[0]?.total_products,
      products_limit: limit,
      products,
    });
  } catch (error) {
    next(error);
  }
};
