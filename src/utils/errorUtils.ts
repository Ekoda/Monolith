
export function validatePresent<T>(value: T | null | undefined, errorMessage?: string): T {
    if (value === null || value === undefined) {
        throw new Error(errorMessage || "Value is null or undefined");
    }
    return value;
}