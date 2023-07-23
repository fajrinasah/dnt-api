// IMPORT MODELS
import { User } from "./user.js";
import { Role } from "./role.js";
import { UserStatus } from "./user_status.js";

import { Product } from "./product.js";
import { Category } from "./category.js";
import { ProductStatus } from "./product_status.js";

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
Category.hasMany(Product, {
  foreignKey: "category_id",
});

Product.belongsTo(Category, {
  foreignKey: "category_id",
});

// ASSOCIATION BETWEEN PRODUCT'S STATUS & PRODUCT
ProductStatus.hasMany(Product, {
  foreignKey: "product_status_id",
});

Product.belongsTo(ProductStatus, {
  foreignKey: "product_status_id",
});

// EXPORT MODELS
export { Category, Product, ProductStatus, Role, User, UserStatus };
