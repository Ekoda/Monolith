
export function assert(condition: boolean, errorMessage?: string): asserts condition {
    if (!condition) {
        throw new Error(errorMessage || "Assertion failed");
    }
}

export function checkType<T>(value: unknown, type: string, errorMessage?: string): value is T {
    if (typeof value !== type) {
        throw new Error(errorMessage || `Expected ${type}, got ${typeof value}`);
    }
    return true;
}

export async function retry<T>(fn: () => Promise<T>, retries: number = 3): Promise<T> {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
        }
    }
    throw new Error(`All ${retries} retry attempts failed. Last error: ${lastError}`);
}

export function validatePresent<T>(value: T | null | undefined, errorMessage?: string): T {
    if (value === null || value === undefined) {
        throw new Error(errorMessage || "Value is null or undefined");
    }
    return value;
}
