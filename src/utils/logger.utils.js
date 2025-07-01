export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["FATAL"] = 4] = "FATAL";
})(LogLevel || (LogLevel = {}));
class Logger {
    minLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.WARN;
    remoteHandler = null;
    setLevel(level) {
        this.minLevel = level;
    }
    setRemoteHandler(handler) {
        this.remoteHandler = handler;
    }
    shouldLog(level) {
        return level >= this.minLevel;
    }
    log(level, message, context) {
        if (!this.shouldLog(level))
            return;
        const entry = {
            level,
            message,
            context,
            timestamp: new Date().toISOString()
        };
        // Console output in dev, warn/error/fatal in prod
        if (import.meta.env.DEV || level >= LogLevel.WARN) {
            const levelStr = LogLevel[level];
            // eslint-disable-next-line no-console
            console[level >= LogLevel.ERROR ? 'error' : level === LogLevel.WARN ? 'warn' : 'log'](`[${entry.timestamp}] [${levelStr}]`, entry.message, entry.context || '');
        }
        // Remote log shipping
        if (this.remoteHandler) {
            try {
                this.remoteHandler(entry);
            }
            catch (e) {
                // eslint-disable-next-line no-console
                console.error('[Logger] Remote handler error', e);
            }
        }
    }
    debug(message, context) {
        this.log(LogLevel.DEBUG, message, context);
    }
    info(message, context) {
        this.log(LogLevel.INFO, message, context);
    }
    warn(message, context) {
        this.log(LogLevel.WARN, message, context);
    }
    error(message, context) {
        this.log(LogLevel.ERROR, message, context);
    }
    fatal(message, context) {
        this.log(LogLevel.FATAL, message, context);
    }
}
export const logger = new Logger();
