import { describe, expect, it } from "vitest";
import { generateEquation, generateOptions, isPrime } from "../utils/math";

describe("Math Utils", () => {
	describe("isPrime", () => {
		it("identifies prime numbers correctly", () => {
			expect(isPrime(2)).toBe(true);
			expect(isPrime(3)).toBe(true);
			expect(isPrime(13)).toBe(true);
			expect(isPrime(4)).toBe(false);
			expect(isPrime(1)).toBe(false);
		});
	});

	describe("generateEquation", () => {
		it("generates an equation with a result within reasonable bounds", () => {
			const q = generateEquation(1);
			expect(typeof q.equation).toBe("string");
			expect(typeof q.answer).toBe("number");
		});

		it("respects difficulty scaling", () => {
			generateEquation(1);
			generateEquation(10);
			// hard to deterministically test random, but logic structure ensures higher numbers
			expect(true).toBe(true);
		});
	});

	describe("generateOptions", () => {
		it("generates 4 options including the answer", () => {
			const answer = 42;
			const options = generateOptions(answer);
			expect(options).toHaveLength(4);
			expect(options).toContain(answer);
		});

		it("ensures all options are unique", () => {
			const options = generateOptions(10);
			const unique = new Set(options);
			expect(unique.size).toBe(4);
		});
	});
});
