export const productsQueryBuilder = ({
  page = 1,
  limit = 10,
  status = 0,
  category,
  name = "",
  timesort = "",
  namesort = "",
  pricesort = "",
}) => {
  let query =
    "SELECT DISTINCT p.id, p.name, p.image, p.description, p.price, p.product_status_id, p.created_at, p.updated_at FROM products AS p LEFT JOIN products_categories AS pc ON p.id = pc.product_id";

  const qCategoryNull = `pc.category_id IS NULL`;
  const qCategoryNotNull = `pc.category_id = ${category}`;
  const qStatus = `p.product_status_id = ${status}`;
  const qName = `p.name LIKE '%${name}%'`;
  const qSortName = `ORDER BY p.name`;
  const qSortTime = `ORDER BY p.id`;
  const qSortPrice = `ORDER BY p.price`;

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

  // SORT BY TIME
  if (timesort) {
    if (timesort === "ASC") {
      query += ` ${qSortTime} ASC`;
    } else {
      query += ` ${qSortTime} DESC`;
    }
  }

  // SORT BY NAME
  if (namesort) {
    if (namesort === "ASC") {
      query += ` ${qSortName} ASC`;
    } else {
      query += ` ${qSortName} DESC`;
    }
  }

  // SORT BY PRICE
  if (pricesort) {
    if (pricesort === "ASC") {
      query += ` ${qSortPrice} ASC`;
    } else {
      query += ` ${qSortPrice} DESC`;
    }
  }

  // DI QUERY TUH OFFSET DULU BARU LIMIT
  //   const limit = limit;
  const offset = page > 1 ? (page - 1) * limit : 0;

  // OFFSET & LIMIT
  if (offset) {
    query += ` LIMIT ${offset}, ${limit}`;
  } else {
    query += ` LIMIT ${limit}`;
  }

  return query;
};
