import * as Yup from "yup";

/*----------------------------------------------------
EDIT CATEGORY VALIDATION SCHEMA
-----------------------------------------------------*/
export const editCategoryValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Category name's length should be between 3 to 45 characters.")
    .max(45, "Category name's length should be between 3 to 45 characters."),
});
