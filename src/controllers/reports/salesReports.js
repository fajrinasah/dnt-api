/*----------------------------------------------------*/
// SALES REPORTS
/*----------------------------------------------------*/

import { Op } from "sequelize";
import {
  TransactionsProducts,
  Transactions,
  Product,
  User,
} from "../../models/associations.js";

export const createSalesReportByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate, username } = req.body;

    const whereClause = {
      created_at: {
        [Op.gte]: startDate,
        [Op.lte]: new Date(endDate).setDate(new Date(endDate).getDate() + 1),
      },
    };

    if (username) {
      const cashier = await User.findOne({
        where: { username },
      });

      if (cashier) {
        whereClause.cashier_id = cashier.id;
      }
    }

    const transactions = await Transactions.findAll({
      where: whereClause,
      include: [
        {
          model: TransactionsProducts,
          attributes: ["product_id", "quantity", "total_product_price"],
          include: [
            {
              model: Product,
              attributes: ["name", "image"],
            },
          ],
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
          name: product.product.name,
          image: product.product.image,
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
