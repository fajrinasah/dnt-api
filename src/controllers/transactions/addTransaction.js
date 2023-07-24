/*----------------------------------------------------*/
// ADD TRANSACTIONS
/*----------------------------------------------------*/

import { Product } from "../../models/product.js";
import { Transactions } from "../../models/transactions.js";
import { TransactionsProducts } from "../../models/transactions_products.js";
import { User } from "../../models/user.js";

export const addTransaction = async (req, res, next) => {
  try {
    const { uuid } = req.user;
    const { products } = req.body;

    // GET USER'S DATA AND PROFILE
    const user = await User.findOne({ where: { uuid } });

    const cashier_id = user.dataValues.id;

    // CHECK IF ALL PRODUCTS EXIST BEFORE PROCEEDING
    const productIds = products.map((product) => product.product_id);
    const foundProducts = await Product.findAll({
      where: { id: productIds },
    });

    if (foundProducts.length !== productIds.length) {
      throw {
        status: errorStatus.NOT_FOUND_STATUS,
        message: errorMessage.NOT_FOUND + ": Some products not found.",
      };
    }

    // CALCULATE THE total_transaction_price BY SUMMING total_product_price FOR EACH PRODUCT
    let calculatedTotalPrice = 0;
    const transactionsProducts = [];
    for (const product of products) {
      const foundProduct = foundProducts.find(
        (p) => p.id === product.product_id
      );
      const total_product_price = foundProduct.price * product.quantity;
      calculatedTotalPrice += total_product_price;

      transactionsProducts.push({
        transaction_id: 0, // THIS WILL BE UPDATED AFTER CREATING THE TRANSACTION
        product_id: product.product_id,
        quantity: product.quantity,
        total_product_price,
      });
    }

    // CREATE THE TRANSACTION RECORD
    const transaction = await Transactions.create({
      cashier_id: cashier_id,
      total_transaction_price: calculatedTotalPrice,
      created_at: new Date(),
    });

    // UPDATE THE transaction_id AND CREATE transactionsProducts
    const updatedTransactionsProducts = transactionsProducts.map((tp) => ({
      ...tp,
      transaction_id: transaction.id,
    }));
    await TransactionsProducts.bulkCreate(updatedTransactionsProducts);

    // SEND RESPONSE
    res.status(200).json({
      message: "Transaction recorded successfully.",
      transaction,
    });
  } catch (error) {
    next(error);
  }
};
