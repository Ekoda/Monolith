import {getCurrentTime} from "@/utils/timeUtils";

export interface LogEntry {
    level: "debug" | "info" | "warn" | "error";
    message: string;
    error?: Error;
    metadata?: Record<string, any>;
    timestamp?: Date;
}

export interface Logger {
    log: (entry: LogEntry) => Promise<void | Error>;
}

function appendBaseEntry(entry: LogEntry): LogEntry {
    return {
        ...entry,
        metadata: {
            environment: process.env.NODE_ENV,
            errorMessage: entry.error?.message,
            errorStack: entry.error?.stack,
            ...entry.metadata
        },
    }
}

/**
 * Default sink: one JSON line per entry on stdout/stderr, which Vercel (and most hosts)
 * capture as structured logs. Swap this out for Axiom/Datadog/etc. when needed.
 */
function writeToConsole(entry: LogEntry): void {
    // Error objects don't serialize (JSON.stringify gives {}); message/stack are already in metadata
    const {error, ...rest} = entry;
    const line = JSON.stringify(rest);
    switch (entry.level) {
        case "error": console.error(line); break;
        case "warn": console.warn(line); break;
        case "debug": console.debug(line); break;
        default: console.log(line);
    }
}

class AppLogger implements Logger {
    async log({timestamp = getCurrentTime(), ...entry}: LogEntry): Promise<void | Error> {
        try {
            const finalEntry = appendBaseEntry({...entry, timestamp});
            writeToConsole(finalEntry);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(new Error("Logging failed"));
        }
    }
}

export function withLogging<T>(func: (...args: any[]) => T, ...args: any[]): T {
    try {
        return func(...args);
    } catch (e) {
        if (e instanceof Error) {
            logger.log({
                level: "error",
                message: e.message,
                error: e
            }).catch(console.error);
        } else {
            logger.log({
                level: "error",
                message: "An unknown error occurred",
            }).catch(console.error);
        }
        throw e;
    }
}

export const logger = new AppLogger();