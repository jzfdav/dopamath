import { createContext, type ReactNode, useContext, useReducer } from "react";
import { gameReducer, initialState } from "./reducer";
import type { GameAction, GameState } from "./types";

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
