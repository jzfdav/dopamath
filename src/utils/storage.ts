import type { GameMode } from "@/context/GameContext";

const STORAGE_KEY = "dopamath_history";

export interface HistoryEntry {
	date: number;
	mode: GameMode;
	score: number;
	duration: number; // in minutes/seconds
	accuracy: number;
}

export interface HistoryEntry {
	date: number;
	mode: GameMode;
	score: number;
	duration: number; // minutes
	accuracy: number;
}

interface SaveResultParams {
	score: number;
	mode: GameMode;
	answersAttempted: number;
	duration?: number;
	timestamp?: number;
}

export const saveGameResult = ({
	score,
	mode,
	answersAttempted,
	duration = 0,
	timestamp = Date.now(),
}: SaveResultParams) => {
	const history = getHistory();
	// Assuming 10 points per correct answer for accuracy calculation if correctCount not stored
	const entry: HistoryEntry = {
		date: timestamp,
		mode,
		score,
		duration,
		accuracy:
			answersAttempted > 0
				? Math.round((score / (answersAttempted * 10)) * 100)
				: 0,
	};

	history.push(entry);
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
