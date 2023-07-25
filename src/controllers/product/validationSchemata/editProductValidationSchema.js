import * as Yup from "yup";

/*----------------------------------------------------
EDIT PRODUCT VALIDATION SCHEMA
-----------------------------------------------------*/
export const editProductValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Product name's length should be between 3 to 45 characters.")
    .max(45, "Product name's length should be between 3 to 45 characters."),

  description: Yup.string()
    .min(
      10,
      "Product description's length should be between 10 to 255 characters."
    )
    .max(
      255,
      "Product description's length should be between 10 to 255 characters."
    ),

  price: Yup.number(),

  categoryIdArr: Yup.array(),
});
