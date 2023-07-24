import * as Yup from "yup";

/*----------------------------------------------------
ADD PRODUCT VALIDATION SCHEMA
-----------------------------------------------------*/
export const addProductValidationSchema = Yup.object({
  name: Yup.string()
    .required("Product name is required.")
    .min(3, "Product name's length should be between 3 to 45 characters.")
    .max(45, "Product name's length should be between 3 to 45 characters."),

  description: Yup.string()
    .required("Product description is required.")
    .min(
      10,
      "Product description's length should be between 10 to 255 characters."
    )
    .max(
      255,
      "Product description's length should be between 10 to 255 characters."
    ),

  price: Yup.number().required("Product price is required."),

  category_id: Yup.number().required("Product category is required."),
});
