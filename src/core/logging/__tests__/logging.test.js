import { afterEach, describe, expect, it } from 'bun:test';

import { normalizeError } from '../error-handler.ts';
import { createFeatureLogger, getMinimumLogLevel, LOG_LEVELS } from '../logger.ts';

describe('central logger', () => {
  const originalConsoleLog = console.log;

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it('defines all supported levels and configures severity by environment', () => {
    expect(Object.keys(LOG_LEVELS)).toEqual(['debug', 'info', 'warn', 'error']);
    expect(getMinimumLogLevel(true)).toBe('debug');
    expect(getMinimumLogLevel(false)).toBe('error');
  });

  it('prefixes messages with a feature namespace', () => {
    const messages = [];
    console.log = (message) => messages.push(String(message));

    createFeatureLogger('finance').error('Could not load summary');

    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('finance');
    expect(messages[0]).toContain('Could not load summary');
  });

  it('omits non-string values instead of serializing sensitive data', () => {
    const messages = [];
    console.log = (message) => messages.push(String(message));
    const sensitiveData = { salary: 'synthetic-salary' };

    createFeatureLogger('finance').error(sensitiveData);

    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('A non-string log message was omitted.');
    expect(messages[0]).not.toContain(sensitiveData.salary);
  });

  it('normalizes Error instances and thrown strings without serializing objects', () => {
    const error = new Error('Database is unavailable');
    const privateData = { password: 'synthetic-password' };

    expect(normalizeError(error)).toBe(error);
    expect(normalizeError('A useful failure')).toEqual(new Error('A useful failure'));
    expect(normalizeError(privateData).message).toBe('An unknown non-Error value was thrown.');
    expect(normalizeError(privateData).message).not.toContain(privateData.password);
  });
});
