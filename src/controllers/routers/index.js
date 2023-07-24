// IMPORT ALL ROUTERS
import authRouters from "../auth/routers.js";
import cashierRouters from "../cashier/routers.js";
import cashiersRouters from "../cashiers/routers.js";

import productControllers from "../product/routers.js";
import productsControllers from "../products/routers.js";

// EXPORT ALL ROUTERS AS ROUTER OBJECT
export {
  authRouters,
  cashierRouters,
  cashiersRouters,
  productControllers,
  productsControllers,
};
