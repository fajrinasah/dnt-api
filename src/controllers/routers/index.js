// IMPORT ALL ROUTERS
import authRouters from "../auth/routers.js";
import profilesControllers from "../profiles/routers.js";
import cashierRouters from "../cashier/routers.js";
import cashiersRouters from "../cashiers/routers.js";
import categoryRouters from "../category/routers.js";
import categoriesRouters from "../categories/routers.js";

// EXPORT ALL ROUTERS AS ROUTER OBJECT
export {
  authRouters,
  profilesControllers,
  cashierRouters,
  cashiersRouters,
  categoryRouters,
  categoriesRouters,
};
