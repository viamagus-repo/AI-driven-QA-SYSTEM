/* eslint-disable */
// AUTO-GENERATED FILE. DO NOT EDIT.
// Run: npx ts-node tools/generate-flow-registry.ts

import * as flowModule0 from "../../flows/auth/emailField.flow";
import * as flowModule1 from "../../flows/auth/loginInvalidPassword.flow";
import * as flowModule2 from "../../flows/auth/loginInvalidUsername.flow";
import * as flowModule3 from "../../flows/auth/loginLogout.flow";
import * as flowModule4 from "../../flows/auth/loginValid.flow";
import * as flowModule5 from "../../flows/Users/create.flow";
import * as flowModule6 from "../../flows/Users/delete.flow";

export type FlowModuleNamespace = Record<string, unknown> & {
  default?: unknown;
};

export const generatedFlowRegistry: Record<
  string,
  Record<string, FlowModuleNamespace>
> = {
  "auth": {
    "emailField": flowModule0,
    "loginInvalidPassword": flowModule1,
    "loginInvalidUsername": flowModule2,
    "loginLogout": flowModule3,
    "loginValid": flowModule4,
  },
  "users": {
    "create": flowModule5,
    "delete": flowModule6,
  },
};
