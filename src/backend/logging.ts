import {getCurrentTime} from "@/utils/timeUtils";

interface LogEntry {
    level: "debug" | "info" | "warn" | "error";
    message: string;
    metadata?: Record<string, any>;
    timestamp?: Date;
}

export interface Logger {
    log: (entry: LogEntry) => Promise<void | Error>;
}

class AppLogger implements Logger {
    async log({timestamp = getCurrentTime(), ...entry}: LogEntry): Promise<void | Error> {
        try {
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
    } catch (error) {
        if (error instanceof Error) {
            logger.log({ level: "error", message: error.message }).catch(console.error);
        } else {
            logger.log({ level: "error", message: "An unknown error occurred" }).catch(console.error);
        }
        throw error;
    }
}

export const logger = new AppLogger();