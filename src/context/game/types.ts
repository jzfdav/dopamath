export type GameMode = "prime" | "blitz";
export type ContentMode = "arithmetic" | "mixed";
export type GameStatus = "idle" | "playing" | "paused" | "finished";

export interface GameState {
	status: GameStatus;
	mode: GameMode;
	contentMode: ContentMode;
	score: number;
	answersAttempted: number;
	correctAnswers: number;
	streak: number;
	timeLeft: number; // in seconds
	totalTime: number; // initial time in seconds
	difficulty: number; // level multiplier
	history: GameHistoryItem[];
	lifelines: {
		fiftyFifty: boolean;
		skip: boolean;
		freezeTime: boolean;
		secondChance: boolean;
		simplify: boolean;
	};
}

export interface GameHistoryItem {
	id: string;
	equation: string;
	userAnswer: number | string;
	correctAnswer: number;
	isCorrect: boolean;
	points: number;
	scoreAfter: number;
	timestamp: number;
}

export type GameAction =
	| {
			type: "START_GAME";
			payload: { mode: GameMode; contentMode: ContentMode; duration: number };
	  }
	| { type: "PAUSE_GAME" }
	| { type: "RESUME_GAME" }
	| { type: "END_GAME" }
	| { type: "TICK_TIMER" }
	| {
			type: "ANSWER_QUESTION";
			payload: {
				id: string;
				isCorrect: boolean;
				points: number;
				equation: string;
				correctAnswer: number;
				selectedAnswer: number;
				timestamp: number;
				newDifficulty: number;
			};
	  }
	| {
			type: "USE_LIFELINE";
			payload: {
				name:
					| "fiftyFifty"
					| "skip"
					| "freezeTime"
					| "secondChance"
					| "simplify";
			};
	  }
	| { type: "ADD_TIME"; payload: { seconds: number } };
