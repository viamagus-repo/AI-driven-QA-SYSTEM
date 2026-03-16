/* eslint-disable */
// AUTO-GENERATED FILE. DO NOT EDIT.
// Run: npx ts-node tools/generate-flow-registry.ts

import * as flowModule0 from "../../flows/auth/loginInvalidPassword.flow";
import * as flowModule1 from "../../flows/auth/loginInvalidUsername.flow";
import * as flowModule2 from "../../flows/auth/loginLogout.flow";
import * as flowModule3 from "../../flows/auth/loginValid.flow";
import * as flowModule4 from "../../flows/users/create.flow";

export type FlowModuleNamespace = Record<string, unknown> & {
  default?: unknown;
};

export const generatedFlowRegistry: Record<
  string,
  Record<string, FlowModuleNamespace>
> = {
  "auth": {
    "loginInvalidPassword": flowModule0,
    "loginInvalidUsername": flowModule1,
    "loginLogout": flowModule2,
    "loginValid": flowModule3,
  },
  "users": {
    "create": flowModule4,
  },
};
