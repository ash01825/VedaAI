type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatMessage(level: LogLevel, ...args: unknown[]): string {
  const timestamp = new Date().toISOString();
  const parts = args.map((a) =>
    typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
  );
  return `[${timestamp}] [${level.toUpperCase()}] ${parts.join(' ')}`;
}

export const logger = {
  info: (...args: unknown[]): void => {
    console.log(formatMessage('info', ...args));
  },
  warn: (...args: unknown[]): void => {
    console.warn(formatMessage('warn', ...args));
  },
  error: (...args: unknown[]): void => {
    console.error(formatMessage('error', ...args));
  },
  debug: (...args: unknown[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('debug', ...args));
    }
  },
};
