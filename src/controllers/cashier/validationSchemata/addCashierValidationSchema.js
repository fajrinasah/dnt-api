import * as Yup from "yup";

/*----------------------------------------------------
ADD CASHIER VALIDATION SCHEMA
-----------------------------------------------------*/
export const addCashierValidationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required.")
    .email("Email must be valid.")
    .matches(
      /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/,
      "Email domain must be included."
    )
    .min(10, "Email address' length should be between 10 to 45 characters.")
    .max(45, "Email address' length should be between 10 to 45 characters."),

  username: Yup.string()
    .required("Username is required.")
    .min(5, "Username's length should be between 5 to 45 characters.")
    .max(45, "Username's length should be between 5 to 45 characters."),
});
