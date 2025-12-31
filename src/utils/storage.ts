import type { GameMode } from "@/context/GameContext";

const STORAGE_KEY = "dopamath_history";

export interface HistoryEntry {
	date: number;
	mode: GameMode;
	score: number;
	duration: number; // in minutes/seconds
	accuracy: number;
}

export const saveGameResult = (
	score: number,
	mode: GameMode,
	totalQuestions: number,
	correctQuestions: number,
	duration: number,
) => {
	const history = getHistory();
	const entry: HistoryEntry = {
		date: Date.now(),
		mode,
		score,
		duration,
		accuracy:
			totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0,
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
