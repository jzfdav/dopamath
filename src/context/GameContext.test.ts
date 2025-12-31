import { describe, expect, it } from "vitest";
import { type GameAction, type GameState } from "./game/types";
import { gameReducer } from "./game/reducer";

describe("gameReducer", () => {
	const initialState: GameState = {
		status: "playing",
		mode: "prime",
		contentMode: "mixed",
		score: 0,
		answersAttempted: 0,
		correctAnswers: 0,
		streak: 0,
		timeLeft: 0,
		totalTime: 0,
		difficulty: 1,
		history: [],
		lifelines: {
			fiftyFifty: true,
			skip: true,
			freezeTime: true,
			secondChance: true,
			simplify: true,
		},
	};

	it("should start game and reset state", () => {
		const prevState = {
			...initialState,
			score: 100,
			status: "finished" as const,
		};
		const action: GameAction = {
			type: "START_GAME",
			payload: { mode: "blitz", contentMode: "mixed", duration: 1 },
		};
		const state = gameReducer(prevState, action);

		expect(state.status).toBe("playing");
		expect(state.score).toBe(0);
		expect(state.mode).toBe("blitz");
		expect(state.timeLeft).toBe(60);
	});

	it("should handle correct answer and update history", () => {
		const action: GameAction = {
			type: "ANSWER_QUESTION",
			payload: {
				id: "1",
				isCorrect: true,
				points: 10,
				equation: "2 + 2",
				correctAnswer: 4,
				selectedAnswer: 4,
				timestamp: 1000,
			},
		};
		const state = gameReducer(initialState, action);

		expect(state.score).toBe(10);
		expect(state.correctAnswers).toBe(1);
		expect(state.answersAttempted).toBe(1);
		expect(state.streak).toBe(1);
		expect(state.history).toHaveLength(1);
		expect(state.history[0].scoreAfter).toBe(10);
	});

	it("should handle wrong answer and reset streak", () => {
		const prevState = { ...initialState, streak: 5, score: 50 };
		const action: GameAction = {
			type: "ANSWER_QUESTION",
			payload: {
				id: "2",
				isCorrect: false,
				points: 0,
				equation: "5 * 5",
				correctAnswer: 25,
				selectedAnswer: 20,
				timestamp: 2000,
			},
		};
		const state = gameReducer(prevState, action);

		expect(state.score).toBe(50);
		expect(state.streak).toBe(0);
		expect(state.answersAttempted).toBe(1);
		expect(state.history[0].isCorrect).toBe(false);
	});

	it("should end game when timer hits 0", () => {
		const prevState = {
			...initialState,
			timeLeft: 1,
			status: "playing" as const,
		};
		const state = gameReducer(prevState, { type: "TICK_TIMER" });
		expect(state.timeLeft).toBe(0);
		expect(state.status).toBe("playing"); // It only finishes ON the next tick if <= 0

		const finalState = gameReducer(state, { type: "TICK_TIMER" });
		expect(finalState.status).toBe("finished");
	});
});
