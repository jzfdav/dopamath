// Utility to generate math equations

export type Operation = "+" | "-" | "*" | "/";

interface Question {
	equation: string;
	answer: number;
}

function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isPrime(num: number): boolean {
	if (num <= 1) return false;
	for (let i = 2; i <= Math.sqrt(num); i++) {
		if (num % i === 0) return false;
	}
	return true;
}

function calculate(a: number, b: number, op: Operation): number {
	switch (op) {
		case "+":
			return a + b;
		case "-":
			return a - b;
		case "*":
			return a * b;
		case "/":
			return a / b;
		default:
			return a + b;
	}
}

export function generateEquation(
	difficulty: number,
	contentMode: "arithmetic" | "mixed" = "mixed",
): Question {
	let operation: Operation = "+";
	const r = Math.random();

	// Determine operation based on difficulty and mode
	if (contentMode === "arithmetic") {
		operation = r > 0.5 ? "+" : "-";
	} else {
		// Progressive introduction of operations
		if (difficulty <= 3) {
			// Easy start: mostly +, some -
			operation = r > 0.4 ? "+" : "-";
		} else if (difficulty <= 6) {
			// Mid level: introduce * but keep it simple
			if (r < 0.4) operation = "+";
			else if (r < 0.7) operation = "-";
			else operation = "*";
		} else {
			// High level: all operations
			if (r < 0.3) operation = "+";
			else if (r < 0.6) operation = "-";
			else if (r < 0.8) operation = "*";
			else operation = "/";
		}
	}

	let a = 0;
	let b = 0;

	// Helper to scale range slowly
	// Diff 1: max 10
	// Diff 10: max 100+
	const getRange = (mult: number = 10) => {
		// Base range starts at 10, increases by ~2 per level early on, then faster
		const base = 10;
		const expansion = Math.max(0, difficulty - 1) * 3; // +3 range per level
		return Math.floor((base + expansion) * (mult / 10)); // Adjust multiplier if needed
	};

	const maxVal = getRange();

	switch (operation) {
		case "+":
			a = getRandomInt(0, maxVal);
			b = getRandomInt(0, maxVal);
			break;
		case "-":
			a = getRandomInt(Math.floor(maxVal / 2), maxVal + 5);
			b = getRandomInt(0, a);
			break;
		case "*":
			// Keep multiplication simpler than addition
			// Diff 1-3: shouldn't hit here due to logic above
			// Diff 4-6: small numbers (2-5) * (2-10)
			// Diff 7+: larger
			{
				const limit = Math.floor(Math.sqrt(maxVal)) + 2;
				a = getRandomInt(2, limit);
				b = getRandomInt(2, 10 + Math.floor(difficulty / 2));
			}
			break;
		case "/":
			// Division: Result should be within range
			b = getRandomInt(2, 10); // Divisor
			a = b * getRandomInt(2, 10 + Math.floor(difficulty / 2)); // Dividend
			break;
	}

	return {
		equation: `${a} ${operation} ${b}`,
		answer: calculate(a, b, operation),
	};
}

export function generateOptions(
	correctAnswer: number,
	count = 4,
): number[] {
	const options = new Set<number>();
	options.add(correctAnswer);

	let attempts = 0;
	while (options.size < count && attempts < 100) {
		attempts++;
		const variance = getRandomInt(1, 15);
		const direction = Math.random() > 0.5 ? 1 : -1;
		const option = correctAnswer + variance * direction;
		if (option >= 0 && !options.has(option)) {
			options.add(option);
		}
	}

	// Fallback if loop fails
	while (options.size < count) {
		const fallback = correctAnswer + options.size + 1;
		options.add(fallback);
	}

	return Array.from(options).sort(() => Math.random() - 0.5);
}
