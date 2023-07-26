export const countProductsQueryBuilder = ({
  status = 0,
  category,
  name = "",
}) => {
  let query =
    "SELECT COUNT(DISTINCT name) as total_products FROM products AS p LEFT JOIN products_categories AS pc ON p.id = pc.product_id";

  const qCategoryNull = `pc.category_id IS NULL`;
  const qCategoryNotNull = `pc.category_id = ${category}`;
  const qStatus = `p.product_status_id = ${status}`;
  const qName = `p.name LIKE '%${name}%'`;

  // FILTER BY CATEGORY'S ID
  if (category !== undefined) {
    if (category === null || category === "null") {
      query += ` WHERE ${qCategoryNull}`;
    } else {
      query += ` WHERE ${qCategoryNotNull}`;
    }
  }

  // FILTER BY PRODUCT'S STATUS
  if (category && status) {
    query += ` AND ${qStatus}`;
  } else if (status) {
    query += ` WHERE ${qStatus}`;
  }

  // SEARCH SUBSTRING IN PRODUCT'S NAME AFTER FILTERING (or not)
  if (name) {
    if (category || status) {
      query += ` AND ${qName}`;
    } else {
      query += ` WHERE ${qName}`;
    }
  }

  return query;
};
