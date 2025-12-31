import { createContext, type ReactNode, useContext, useReducer } from "react";

// --- Types ---

export type GameMode = "prime" | "blitz";
export type GameStatus = "idle" | "playing" | "paused" | "finished";

export interface GameState {
	status: GameStatus;
	mode: GameMode;
	score: number;
	answersAttempted: number; // For accuracy
	streak: number;
	timeLeft: number; // in seconds
	totalTime: number; // initial time in seconds
	difficulty: number; // level multiplier
	history: GameHistoryItem[];
	lifelines: {
		fiftyFifty: boolean;
		skip: boolean;
		freezeTime: boolean;
	};
}

export interface GameHistoryItem {
	id: string;
	equation: string;
	userAnswer: number | string;
	correctAnswer: number;
	isCorrect: boolean;
	timestamp: number;
}

export type GameAction =
	| { type: "START_GAME"; payload: { mode: GameMode; duration: number } }
	| { type: "PAUSE_GAME" }
	| { type: "RESUME_GAME" }
	| { type: "END_GAME" }
	| { type: "TICK_TIMER" }
	| { type: "ANSWER_QUESTION"; payload: { isCorrect: boolean; points: number } }
	| {
			type: "USE_LIFELINE";
			payload: { name: "fiftyFifty" | "skip" | "freezeTime" };
	  };

// --- Initial State ---

const initialState: GameState = {
	status: "idle",
	mode: "prime",
	score: 0,
	answersAttempted: 0,
	streak: 0,
	timeLeft: 0,
	totalTime: 0,
	difficulty: 1,
	history: [],
	lifelines: {
		fiftyFifty: true,
		skip: true,
		freezeTime: true,
	},
};

// --- Reducer ---

function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "START_GAME":
			return {
				...initialState,
				status: "playing",
				mode: action.payload.mode,
				timeLeft: action.payload.duration * 60,
				totalTime: action.payload.duration * 60,
			};

		case "PAUSE_GAME":
			return { ...state, status: "paused" };

		case "RESUME_GAME":
			return { ...state, status: "playing" };

		case "END_GAME":
			return { ...state, status: "finished" };

		case "TICK_TIMER":
			if (state.timeLeft <= 0)
				return { ...state, status: "finished", timeLeft: 0 };
			return { ...state, timeLeft: state.timeLeft - 1 };

		case "ANSWER_QUESTION":
			return {
				...state,
				score:
					state.score + (action.payload.isCorrect ? action.payload.points : 0),
				answersAttempted: state.answersAttempted + 1,
				streak: action.payload.isCorrect ? state.streak + 1 : 0,
			};

		case "USE_LIFELINE":
			return {
				...state,
				lifelines: {
					...state.lifelines,
					[action.payload.name]: false,
				},
			};

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
