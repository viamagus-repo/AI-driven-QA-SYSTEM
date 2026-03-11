/* eslint-disable */
// AUTO-GENERATED FILE. DO NOT EDIT.
// Run: npx ts-node tools/generate-flow-registry.ts

import * as flowModule0 from "../../flows/auth/loginInvalidPassword.flow";
import * as flowModule1 from "../../flows/auth/loginInvalidUsername.flow";
import * as flowModule2 from "../../flows/auth/loginLogout.flow";
import * as flowModule3 from "../../flows/auth/loginValid.flow";
import * as flowModule4 from "../../flows/billing/sample.flow";
import * as flowModule5 from "../../flows/email/send.flow";
import * as flowModule6 from "../../flows/Users/create.flow";
import * as flowModule7 from "../../flows/Users/delete.flow";
import * as flowModule8 from "../../flows/Users/edituserpass.flow";
import * as flowModule9 from "../../flows/Users/search.flow";

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
  "billing": {
    "sample": flowModule4,
  },
  "email": {
    "send": flowModule5,
  },
  "user": {
    "create": flowModule6,
    "delete": flowModule7,
    "edituserpass": flowModule8,
    "search": flowModule9,
  },
};
