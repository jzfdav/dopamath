import type { GameMode } from "@/context/GameContext";

const STORAGE_KEY = "dopamath_history";

export interface HistoryEntry {
	date: number;
	mode: GameMode;
	score: number;
	duration: number; // minutes
	accuracy: number;
	correctAnswers: number;
	answersAttempted: number;
}

interface SaveResultParams {
	score: number;
	mode: GameMode;
	correctAnswers: number;
	answersAttempted: number;
	duration?: number;
	timestamp?: number;
}

export const saveGameResult = ({
	score,
	mode,
	correctAnswers,
	answersAttempted,
	duration = 0,
	timestamp = Date.now(),
}: SaveResultParams) => {
	const history = getHistory();
	const entry: HistoryEntry = {
		date: timestamp,
		mode,
		score,
		duration,
		correctAnswers,
		answersAttempted,
		accuracy:
			answersAttempted > 0
				? Math.round((correctAnswers / answersAttempted) * 100)
				: 0,
	};

	history.push(entry);

	// Limit history to last 500 entries to prevent storage overflow
	if (history.length > 500) {
		history.splice(0, history.length - 500);
	}

	localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
	return entry;
};

export const getHistory = (): HistoryEntry[] => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch (e) {
		console.warn("Failed to parse history", e);
		return [];
	}
};

export const getBestScore = (mode: GameMode): number => {
	const history = getHistory();
	const modeHistory = history.filter((h) => h.mode === mode);
	return modeHistory.reduce((max, curr) => Math.max(max, curr.score), 0);
};
