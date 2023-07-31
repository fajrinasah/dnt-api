/*----------------------------------------------------*/
// SALES REPORTS
/*----------------------------------------------------*/

import { Op } from "sequelize";
import {
  TransactionsProducts,
  Transactions,
} from "../../models/associations.js";

export const createSalesReportByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    const transactions = await Transactions.findAll({
      where: {
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: TransactionsProducts,
          attributes: ["product_id", "quantity", "total_product_price"],
        },
      ],
    });

    const salesData = {};
    transactions.forEach((transaction) => {
      const date = transaction.created_at.toISOString().split("T")[0];
      if (!salesData[date]) {
        salesData[date] = {
          date,
          total_sales: 0,
          transactions: [],
        };
      }
      salesData[date].total_sales += transaction.total_transaction_price;
      salesData[date].transactions.push({
        id: transaction.id,
        cashier_id: transaction.cashier_id,
        total_transaction_price: transaction.total_transaction_price,
        created_at: transaction.created_at,
        products: transaction.transactions_products.map((product) => ({
          product_id: product.product_id,
          quantity: product.quantity,
          total_product_price: product.total_product_price,
        })),
      });
    });

    const salesReports = Object.values(salesData);

    res.status(200).json({ salesReports });
  } catch (error) {
    next(error);
  }
};
