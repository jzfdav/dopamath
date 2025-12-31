import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { generateEquation, generateOptions } from "@/utils/math";

export const useGameLogic = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { state, dispatch } = useGame();

	const [question, setQuestion] = useState<{
		equation: string;
		answer: number;
	} | null>(null);
	const [options, setOptions] = useState<number[]>([]);
	const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
	const [isFrozen, setIsFrozen] = useState(false);

	// Check for game over
	useEffect(() => {
		if (state.status === "finished") {
			navigate("/summary");
		}
	}, [state.status, navigate]);

	const nextQuestion = useCallback((difficulty: number) => {
		const q = generateEquation(difficulty);
		setQuestion(q);
		setOptions(generateOptions(q.answer));
		setDisabledOptions([]);
		setIsFrozen(false);
	}, []);

	// Init game (Runs once on mount/params change)
	useEffect(() => {
		const mode = searchParams.get("mode") === "blitz" ? "blitz" : "prime";
		const minutes = parseInt(searchParams.get("minutes") || "2", 10);

		dispatch({
			type: "START_GAME",
			payload: {
				mode,
				duration: mode === "blitz" ? 1 : minutes,
			},
		});

		nextQuestion(1);
	}, [searchParams, dispatch, nextQuestion]);

	// Timer Loop (Runs based on frozen state)
	useEffect(() => {
		if (state.status !== "playing") return;

		const timer = setInterval(() => {
			if (!isFrozen) {
				dispatch({ type: "TICK_TIMER" });
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [isFrozen, state.status, dispatch]);

	// Separate effect for timer pause to not reset game?
	// Actually the previous logic had isFrozen inside the interval check.
	// Let's replicate that behavior correctly.
	// The issue with the previous useEffect was that it depended on isFrozen, so it re-ran (re-started game?) on freeze toggle?
	// No, START_GAME would dispatch again. That's a bug in the original logic if useEffect deps included isFrozen.
	// Let's fix this: Only start game once. Timer runs independently.

	// ... wait, the original code had `isFrozen` in the dependency array of the main useEffect.
	// This implies that whenever `isFrozen` changed, `START_GAME` was called again!
	// That resets the score! BUG FOUND.
	// This refactor is critical.

	return {
		state,
		question,
		options,
		disabledOptions,
		isFrozen,
		setIsFrozen,
		setDisabledOptions,
		nextQuestion,
		dispatch,
	};
};
