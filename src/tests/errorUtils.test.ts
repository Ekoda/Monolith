import {describe, expect, test, jest} from "@jest/globals";
import {assert, checkType, retry, validatePresent} from "@/utils/errorUtils";


describe("errorUtils", () => {
    describe("validatePresent function", () => {
        test("should return the value when it is not null or undefined", () => {
            const value = 42;
            const result = validatePresent(value);
            expect(result).toBe(value);
        });

        test("should throw an error when value is null", () => {
            expect(() => validatePresent(null)).toThrowError("Value is null or undefined");
        });

        test("should throw an error when value is undefined", () => {
            expect(() => validatePresent(undefined)).toThrowError("Value is null or undefined");
        });

        test("should throw a custom error message when provided", () => {
            const customMessage = "Custom Error Message";
            expect(() => validatePresent(null, customMessage)).toThrowError(customMessage);
        });
    });

    describe("assert function", () => {
        test("should not throw an error when condition is true", () => {
            expect(() => assert(true)).not.toThrow();
        });

        test("should throw an error when condition is false", () => {
            expect(() => assert(false)).toThrowError("Assertion failed");
        });

        test("should throw a custom error message when provided", () => {
            const customMessage = "Custom Assertion Error Message";
            expect(() => assert(false, customMessage)).toThrowError(customMessage);
        });
    });

    describe("checkType function", () => {
        test("should return true when types match", () => {
            expect(checkType<number>(42, "number")).toBe(true);
        });

        test("should throw an error when types do not match", () => {
            expect(() => checkType<number>("42", "number")).toThrowError("Expected number, got string");
        });

        test("should throw a custom error message when provided", () => {
            const customMessage = "Custom Type Error Message";
            expect(() => checkType<number>("42", "number", customMessage)).toThrowError(customMessage);
        });
    });

    describe("retry function", () => {
        test("should return the result when the function succeeds", async () => {
            const mockFn = jest.fn(() => Promise.resolve(42));
            const result = await retry(mockFn);
            expect(result).toBe(42);
        });

        test("should retry the function the specified number of times on failure", async () => {
            const mockFn = jest.fn(() => Promise.reject(new Error("Temporary failure")));
            await expect(retry(mockFn, 3)).rejects.toThrowError("All 3 retry attempts failed");
            expect(mockFn).toHaveBeenCalledTimes(3);
        });

        test("should throw the last error when all retries fail", async () => {
            const mockFn = jest.fn(() => Promise.reject(new Error("Temporary failure")));
            await expect(retry(mockFn)).rejects.toThrowError("Last error: Error: Temporary failure");
        });
    });


});