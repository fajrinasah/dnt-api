// IMPORT MODELS
import { User } from "./user.js";
import { Role } from "./Role.js";
import { UserStatus } from "./UserStatus.js";

import { Product } from "./product.js";
import { Category } from "./Category.js";
import { ProductStatus } from "./ProductStatus.js";
import { ProductCategory } from "./ProductCategory.js";
import { Transactions } from "./transactions.js";
import { TransactionsProducts } from "./transactions_products.js";
import { Invoices } from "./invoices.js";

// ASSOCIATION BETWEEN USER'S ROLE & USER
Role.hasMany(User, {
  foreignKey: "role_id",
});

User.belongsTo(Role, {
  foreignKey: "role_id",
});

// ASSOCIATION BETWEEN USER'S STATUS & USER
UserStatus.hasMany(User, {
  foreignKey: "user_status_id",
});

User.belongsTo(UserStatus, {
  foreignKey: "user_status_id",
});

// ASSOCIATION BETWEEN PRODUCT'S CATEGORY & PRODUCT
Category.belongsToMany(Product, {
  through: "products_categories",
  foreignKey: "category_id",
});

Product.belongsToMany(Category, {
  through: "products_categories",
  foreignKey: "product_id",
});

// ASSOCIATION BETWEEN PRODUCT'S CATEGORY & CATEGORY
Category.hasMany(ProductCategory, {
  foreignKey: "category_id",
});

ProductCategory.belongsTo(Category, {
  foreignKey: "category_id",
});

// ASSOCIATION BETWEEN PRODUCT'S STATUS & PRODUCT
ProductStatus.hasMany(Product, {
  foreignKey: "product_status_id",
});

Product.belongsTo(ProductStatus, {
  foreignKey: "product_status_id",
});

// ASSOCIATION BETWEEN TRANSACTIONS AND TRANSACTIONS PRODUCTS
Transactions.belongsToMany(Product, {
  through: TransactionsProducts,
  foreignKey: 'transaction_id',
  otherKey: 'product_id',
});

Product.belongsToMany(Transactions, {
  through: TransactionsProducts,
  foreignKey: 'product_id',
  otherKey: 'transaction_id',
});

// ASSOCIATION BETWEEN INVOICES AND TRANSACTIONS
Invoices.belongsTo(Transactions, {
  foreignKey: 'transaction_id',
});

// EXPORT MODELS
export {
  Category,
  Product,
  ProductCategory,
  ProductStatus,
  Role,
  User,
  UserStatus,
  Transactions,
  TransactionsProducts,
  Invoices
};
