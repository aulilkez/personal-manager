import { logger } from 'react-native-logs';

export const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
} as const;

export type LogLevel = keyof typeof LOG_LEVELS;

export interface FeatureLogger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export function getMinimumLogLevel(isDevelopment: boolean): LogLevel {
  return isDevelopment ? 'debug' : 'error';
}

const isDevelopment = typeof __DEV__ !== 'undefined' && __DEV__;
const baseLogger = logger.createLogger({
  levels: LOG_LEVELS,
  severity: getMinimumLogLevel(isDevelopment),
  printDate: isDevelopment,
  printLevel: true,
});

function logMessage(write: (message: string) => void, message: unknown): void {
  write(typeof message === 'string' ? message : 'A non-string log message was omitted.');
}

export function createFeatureLogger(namespace: string): FeatureLogger {
  if (!/^[a-z][a-z0-9._-]{0,47}$/.test(namespace)) {
    throw new Error('Logger namespace must be a short, lowercase feature name.');
  }

  const scopedLogger = baseLogger.extend(namespace);

  return {
    debug: (message) => logMessage(scopedLogger.debug, message),
    info: (message) => logMessage(scopedLogger.info, message),
    warn: (message) => logMessage(scopedLogger.warn, message),
    error: (message) => logMessage(scopedLogger.error, message),
  };
}
