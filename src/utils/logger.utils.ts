export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogContext {
  [key: string]: any
}

export interface LogEntry {
  level: LogLevel
  message: string
  context?: LogContext
  timestamp: string
}

export type RemoteLogHandler = (entry: LogEntry) => void | Promise<void>

class Logger {
  private minLevel: LogLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN
  private remoteHandler: RemoteLogHandler | null = null

  setLevel(level: LogLevel) {
    this.minLevel = level
  }

  setRemoteHandler(handler: RemoteLogHandler) {
    this.remoteHandler = handler
  }

  private shouldLog(level: LogLevel) {
    return level >= this.minLevel
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.shouldLog(level)) return
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString()
    }
    // Console output in dev, warn/error/fatal in prod
    if (import.meta.env.DEV || level >= LogLevel.WARN) {
      const levelStr = LogLevel[level]
      // eslint-disable-next-line no-console
      console[level >= LogLevel.ERROR ? 'error' : level === LogLevel.WARN ? 'warn' : 'log'](
        `[${entry.timestamp}] [${levelStr}]`,
        entry.message,
        entry.context || ''
      )
    }
    // Remote log shipping
    if (this.remoteHandler) {
      try {
        this.remoteHandler(entry)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[Logger] Remote handler error', e)
      }
    }
  }

  debug(message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, message, context)
  }
  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context)
  }
  warn(message: string, context?: LogContext) {
    this.log(LogLevel.WARN, message, context)
  }
  error(message: string, context?: LogContext) {
    this.log(LogLevel.ERROR, message, context)
  }
  fatal(message: string, context?: LogContext) {
    this.log(LogLevel.FATAL, message, context)
  }
}

export const logger = new Logger() 