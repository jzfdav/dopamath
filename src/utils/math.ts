// Utility to generate math equations

export type Operation = "+" | "-" | "*" | "/";

interface Question {
	equation: string;
	answer: number;
}

const getRandomInt = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateEquation = (difficulty: number): Question => {
	// Difficulty scales from 1 (simple) to 10 (expert)
	// Level 1-2: Addition/Subtraction single/double digits
	// Level 3-5: Add/Sub triple digits, Mul/Div single
	// Level 6-10: Mixed, complex

	let operation: Operation = "+";
	const r = Math.random();

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

	let a = 0,
		b = 0;

	switch (operation) {
		case "+":
			a = getRandomInt(1, 10 * difficulty);
			b = getRandomInt(1, 10 * difficulty);
			break;
		case "-":
			a = getRandomInt(5, 10 * difficulty);
			b = getRandomInt(1, a); // Ensure positive result for now
			break;
		case "*":
			a = getRandomInt(2, 2 + difficulty);
			b = getRandomInt(2, 10);
			break;
		case "/":
			b = getRandomInt(2, 10); // Divisor
			a = b * getRandomInt(2, 2 + difficulty); // Dividend (ensure clean division)
			break;
	}

	return {
		equation: `${a} ${operation} ${b}`,
		answer: calculate(a, b, operation),
	};
};

const calculate = (a: number, b: number, op: Operation): number => {
	switch (op) {
		case "+":
			return a + b;
		case "-":
			return a - b;
		case "*":
			return a * b;
		case "/":
			return a / b;
	}
};

export const generateOptions = (
	correctAnswer: number,
	count: number = 4,
): number[] => {
	const options = new Set<number>();
	options.add(correctAnswer);

	while (options.size < count) {
		const variance = getRandomInt(1, 10);
		const direction = Math.random() > 0.5 ? 1 : -1;
		const option = correctAnswer + variance * direction;
		if (option >= 0 && !options.has(option)) {
			// Keeping positive for simplicity/speed
			options.add(option);
		}
	}

	return Array.from(options).sort(() => Math.random() - 0.5);
};
