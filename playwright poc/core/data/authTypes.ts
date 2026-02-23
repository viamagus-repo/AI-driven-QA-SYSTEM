export type AuthFlowKey =
  | "loginValid"
  | "loginInvalidUsername"
  | "loginInvalidPassword"
  | "loginLogout";

export interface BaseTestCase {
  id: string;
  module: string;
  flowKey: string;
  description: string;
  type: string;
  priority: string;
  suite: string;
  tags: string[];
  steps?: string;
  expectedResult?: string;
  testData: {
    input: Record<string, unknown>;
    expectedData?: Record<string, unknown>;
  };
}

export interface AuthTestCase extends BaseTestCase {
  flowKey: AuthFlowKey;
}

export interface ModuleConfig {
  module: string;
  lastUpdated: string;
  description: string;
  suites: Record<string, string[]>;
  testDataFiles: Record<string, string>;
  tags: Record<string, string[]>;
}