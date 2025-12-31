import { createContext, type ReactNode, useContext, useReducer } from "react";

// --- Types ---

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

// --- Initial State ---

const initialState: GameState = {
	status: "idle",
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

// --- Reducer ---

export function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "START_GAME":
			return {
				...initialState,
				status: "playing",
				mode: action.payload.mode,
				contentMode: action.payload.contentMode,
				timeLeft: action.payload.duration * 60,
				totalTime: action.payload.duration * 60,
			};

		case "PAUSE_GAME":
			return { ...state, status: "paused" };

		case "RESUME_GAME":
			return { ...state, status: "playing" };

		case "END_GAME":
			return { ...state, status: "idle" };

		case "TICK_TIMER":
			if (state.timeLeft <= 0)
				return { ...state, status: "finished", timeLeft: 0 };
			return { ...state, timeLeft: state.timeLeft - 1 };

		case "ANSWER_QUESTION": {
			if (state.status !== "playing") return state;
			const newScore =
				state.score + (action.payload.isCorrect ? action.payload.points : 0);

			const historyItem: GameHistoryItem = {
				id: action.payload.id,
				equation: action.payload.equation,
				userAnswer: action.payload.selectedAnswer,
				correctAnswer: action.payload.correctAnswer,
				isCorrect: action.payload.isCorrect,
				points: action.payload.isCorrect ? action.payload.points : 0,
				scoreAfter: newScore,
				timestamp: action.payload.timestamp,
			};

			return {
				...state,
				score: newScore,
				answersAttempted: state.answersAttempted + 1,
				correctAnswers:
					state.correctAnswers + (action.payload.isCorrect ? 1 : 0),
				streak: action.payload.isCorrect ? state.streak + 1 : 0,
				history: [...state.history, historyItem],
			};
		}

		case "USE_LIFELINE":
			if (state.status !== "playing") return state;
			return {
				...state,
				lifelines: {
					...state.lifelines,
					[action.payload.name]: false,
				},
			};

		case "ADD_TIME":
			if (state.status !== "playing") return state;
			return { ...state, timeLeft: state.timeLeft + action.payload.seconds };

		default:
			return state;
	}
}

// --- Context ---

const GameContext = createContext<{
	state: GameState;
	dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(gameReducer, initialState);

	return (
		<GameContext.Provider value={{ state, dispatch }}>
			{children}
		</GameContext.Provider>
	);
};

export const useGame = () => {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error("useGame must be used within a GameProvider");
	}
	return context;
};
