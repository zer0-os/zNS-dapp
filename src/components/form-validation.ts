import * as React from "react";
import { Validators, ValidationSchema } from "@lemoncode/fonk";
import { createFinalFormValidation } from "@lemoncode/fonk-final-form";

const validationSchema: ValidationSchema = {
  field: {
    subdomain: [
      {
        validator: Validators.required,
        message: "required",
      },
    ],
  },
};

export const formValidation = createFinalFormValidation(validationSchema);
