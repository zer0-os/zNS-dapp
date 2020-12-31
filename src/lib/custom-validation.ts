import React from "react";
import { Validators } from "@lemoncode/fonk";
import { isLowercase } from "@lemoncode/fonk-is-lowercase-validator";
import { RecordValidationFunctionSync } from "@lemoncode/fonk";

interface SubdomainValidatorArgs {
  value: any;
  values?: any;
  customArgs?: any;
  message?: string | string[];
}

export const subdomainValidator: RecordValidationFunctionSync = ({
  values,
}) => {
  const succeeded = !values.isLowercase;

  return {
    succeeded,
    message: succeeded ? "" : "Created",
    type: "SUBDOAMIN_",
  };
};

// interface SubdomainValidatorArgs {
//   value: any;
//   values?: any;
//   customArgs?: any;
//   message?: string | string[];
// }

// interface SubdomainValidationResult {
//   created: boolean;
//   message: string;
// }

// export const validates = (subdomainValidatorArgs: { value: any }) => {
// const { created } = subdomainValidatorArgs.isLowercase.
// const subDomain = value.toLowerCase();
// const { created } = Validators.subDomain.validator({
//   value,
//   subdomainValidatorArgs: { subDomain },
// });
// };
