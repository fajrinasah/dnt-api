// IMPORT MODELS
import { User } from "./User.js";
import { Role } from "./Role.js";
import { UserStatus } from "./UserStatus.js";

import { Product } from "./Product.js";
import { Category } from "./Category.js";
import { ProductStatus } from "./ProductStatus.js";

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
Category.belongsToMany(Product, { through: "products_categories" });

Product.belongsToMany(Category, { through: "products_categories" });

// ASSOCIATION BETWEEN PRODUCT'S STATUS & PRODUCT
ProductStatus.hasMany(Product, {
  foreignKey: "product_status_id",
});

Product.belongsTo(ProductStatus, {
  foreignKey: "product_status_id",
});

// EXPORT MODELS
export { Category, Product, ProductStatus, Role, User, UserStatus };
