import {describe, expect, test} from "@jest/globals";
import {validatePresent} from "@/utils/errorUtils";

describe('validatePresent function', () => {
    // Test that a value passes through correctly
    test('should return the value when it is not null or undefined', () => {
        const value = 42;
        const result = validatePresent(value);
        expect(result).toBe(value);
    });

    // Test that null throws an error
    test('should throw an error when value is null', () => {
        expect(() => validatePresent(null)).toThrowError('Value is null or undefined');
    });

    // Test that undefined throws an error
    test('should throw an error when value is undefined', () => {
        expect(() => validatePresent(undefined)).toThrowError('Value is null or undefined');
    });

    // Test custom error message
    test('should throw a custom error message when provided', () => {
        const customMessage = 'Custom Error Message';
        expect(() => validatePresent(null, customMessage)).toThrowError(customMessage);
    });
});