/*----------------------------------------------------*/
// PRODUCT SOLD
/*----------------------------------------------------*/

import {
  Transactions,
  TransactionsProducts,
  Product,
} from "../../models/associations.js";

export const getProductsSoldForTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transactions.findOne({
      where: { id: transactionId },
      include: [
        {
          model: TransactionsProducts,
          attributes: ["product_id", "quantity", "total_product_price"],
          include: [
            {
              model: Product,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    const productsSold = transaction.transactions_products.map((product) => ({
      product_id: product.product_id,
      quantity: product.quantity,
      total_product_price: product.total_product_price,
      product_name: product.product.name,
    }));

    res.status(200).json({ productsSold });
  } catch (error) {
    next(error);
  }
};
