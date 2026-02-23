type LogLevel = "INFO" | "WARN" | "ERROR";

function timestamp(): string {
  return new Date().toISOString();
}

function write(level: LogLevel, scope: string, message: string): void {
  const line = `[${timestamp()}] [${level}] [${scope}] ${message}`;
  if (level === "ERROR") {
    console.error(line);
    return;
  }
  if (level === "WARN") {
    console.warn(line);
    return;
  }
  console.log(line);
}

export function logInfo(scope: string, message: string): void {
  write("INFO", scope, message);
}

export function logWarn(scope: string, message: string): void {
  write("WARN", scope, message);
}

export function logError(scope: string, message: string): void {
  write("ERROR", scope, message);
}

