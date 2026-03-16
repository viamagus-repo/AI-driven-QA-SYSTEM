export function normalizeModuleValue(raw: string | undefined): string {
  return (raw || "").trim().toLowerCase();
}

export function validateModuleName(
  raw: string | undefined,
  usageMessage: string,
  invalidMessage: string
): string {
  const value = normalizeModuleValue(raw);
  if (!value) {
    throw new Error(usageMessage);
  }
  if (!/^[a-z][a-z0-9_-]*$/.test(value)) {
    throw new Error(invalidMessage);
  }
  return value;
}

export function resolveModuleFromAvailable(
  requestedModuleName: string,
  availableModuleNames: Iterable<string>
): string | undefined {
  const normalizedRequested = normalizeModuleValue(requestedModuleName);
  return [...availableModuleNames].find(
    (candidate) => normalizeModuleValue(candidate) === normalizedRequested
  );
}
