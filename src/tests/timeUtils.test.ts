import {addDays, addHours, addMinutes, addMonths, addWeeks, getCurrentTime} from "@/utils/timeUtils";
import {describe, expect, test} from "@jest/globals";

describe("Time Utility Functions", () => {

    test("getCurrentTime returns a Date object", () => {
        expect(getCurrentTime()).toBeInstanceOf(Date);
    });

    test("addMinutes adds the correct number of minutes", () => {
        const date = new Date(2023, 9, 4, 0, 0, 0, 0);  // October 4, 2023, at 00:00:00
        const newDate = addMinutes(date, 10);
        expect(newDate.getMinutes()).toBe(10);
    });

    test("addHours adds the correct number of hours", () => {
        const date = new Date(2023, 9, 4, 0, 0, 0, 0);
        const newDate = addHours(date, 5);
        expect(newDate.getHours()).toBe(5);
    });

    test("addDays adds the correct number of days", () => {
        const date = new Date(2023, 9, 4);
        const newDate = addDays(date, 3);
        expect(newDate.getDate()).toBe(7);
    });

    test("addWeeks adds the correct number of weeks", () => {
        const date = new Date(2023, 9, 4);
        const newDate = addWeeks(date, 2);
        expect(newDate.getDate()).toBe(18);
    });

    test("addMonths adds the correct number of months", () => {
        const date = new Date(2023, 9, 4);  // October 4, 2023
        const newDate = addMonths(date, 2);
        expect(newDate.getMonth()).toBe(11);  // December
    });

});


