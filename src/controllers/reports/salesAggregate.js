/*----------------------------------------------------*/
// SALES AGGREGATE
/*----------------------------------------------------*/

import { Op } from "sequelize";
import {
  Product,
  Transactions,
  TransactionsProducts,
  User,
} from "../../models/associations.js";

export const getSalesAggregateByDay = async (req, res, next) => {
  try {
    const { date, username } = req.query;

    const whereClause = {
      created_at: {
        [Op.gte]: new Date(date),
        [Op.lt]: new Date(date).setDate(new Date(date).getDate() + 1),
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

    const salesAggregate = {
      date,
      total_sales: transactions.reduce(
        (total, transaction) => total + transaction.total_transaction_price,
        0
      ),
      transactions: transactions.map((transaction) => ({
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
      })),
    };

    res.status(200).json({ salesAggregate });
  } catch (error) {
    next(error);
  }
};
