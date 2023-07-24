import * as Yup from "yup";

/*----------------------------------------------------
PASSWORD VALIDATION SCHEMA
-----------------------------------------------------*/
export const passwordValidationSchema = Yup.object({
  password: Yup.string().required("Password is required."),
});
