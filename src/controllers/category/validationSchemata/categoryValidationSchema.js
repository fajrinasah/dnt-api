import * as Yup from "yup";

/*----------------------------------------------------
ADD CATEGORY VALIDATION SCHEMA
-----------------------------------------------------*/
export const categoryValidationSchema = Yup.object({
  name: Yup.string()
    .required("Category name is required.")
    .min(10, "Category name's length should be between 3 to 45 characters.")
    .max(45, "Category name's length should be between 3 to 45 characters."),

  parent_id: Yup.number("Category's parent id must be a number."),
});
