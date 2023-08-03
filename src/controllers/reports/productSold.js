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
    const transactions = await Transactions.findAll({
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

    const productsSold = transactions.reduce((result, transaction) => {
      transaction.transactions_products.forEach((product) => {
        const { product_id, quantity, total_product_price } = product;

        const existingProduct = result.find((p) => p.product_id === product_id);

        if (existingProduct) {
          existingProduct.quantity += quantity;
          existingProduct.total_product_price += total_product_price;
        } else {
          result.push({
            product_id,
            quantity,
            total_product_price,
            name: product.product.name,
            image: product.product.image,
          });
        }
      });

      return result;
    }, []);

    res.status(200).json({ productsSold });
  } catch (error) {
    next(error);
  }
};
