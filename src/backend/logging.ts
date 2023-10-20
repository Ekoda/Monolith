import {getCurrentTime} from "@/utils/timeUtils";
import {errorEntry} from "@/utils/errorUtils";

export interface LogEntry {
    level: "debug" | "info" | "warn" | "error";
    message: string;
    metadata?: Record<string, any>;
    timestamp?: Date;
}

export interface Logger {
    log: (entry: LogEntry) => Promise<void | Error>;
}

function appendBaseEntry(entry: LogEntry) {
    return {
        ...entry,
        metadata: {
            environment: process.env.NODE_ENV,
            ...entry.metadata
        },
    }
}

class AppLogger implements Logger {
    async log({timestamp = getCurrentTime(), ...entry}: LogEntry): Promise<void | Error> {
        try {
            const finalEntry = appendBaseEntry({...entry, timestamp});

            // Implementation will go here

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
            logger.log(errorEntry(e)).catch(console.error);
        } else {
            logger.log({
                level: "error",
                message: "An unknown error occurred"
            }).catch(console.error);
        }
        throw e;
    }
}

export const logger = new AppLogger();