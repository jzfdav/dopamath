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

	if (contentMode === "arithmetic") {
		operation = r > 0.5 ? "+" : "-";
	} else {
		if (difficulty <= 2) {
			operation = r > 0.5 ? "+" : "-";
		} else if (difficulty <= 5) {
			if (r < 0.3) operation = "+";
			else if (r < 0.6) operation = "-";
			else if (r < 0.8) operation = "*";
			else operation = "/";
		} else {
			if (r < 0.25) operation = "+";
			else if (r < 0.5) operation = "-";
			else if (r < 0.75) operation = "*";
			else operation = "/";
		}
	}

	let a = 0;
	let b = 0;

	switch (operation) {
		case "+":
			a = getRandomInt(1, 10 * difficulty);
			b = getRandomInt(1, 10 * difficulty);
			break;
		case "-":
			a = getRandomInt(5, 10 * difficulty);
			b = getRandomInt(1, a);
			break;
		case "*":
			a = getRandomInt(2, 2 + Math.floor(difficulty / 2));
			b = getRandomInt(2, 10);
			break;
		case "/":
			b = getRandomInt(2, 10);
			a = b * getRandomInt(2, 2 + Math.floor(difficulty / 2));
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
