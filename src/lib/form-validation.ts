import * as React from "react";
import { Validators, ValidationSchema } from "@lemoncode/fonk";
import { createFinalFormValidation } from "@lemoncode/fonk-final-form";
import { isLowercase } from "@lemoncode/fonk-is-lowercase-validator";
// import { subdomainValidator } from "./custom-validation";

const validationSchema: ValidationSchema = {
  field: {
    subdomain: [Validators.required],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
