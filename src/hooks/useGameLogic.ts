import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { useSettings } from "@/context/SettingsContext";
import { generateEquation, generateOptions } from "@/utils/math";

export const useGameLogic = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { settings } = useSettings();
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
		// Guard: Don't restart if already playing or paused
		if (state.status === "playing" || state.status === "paused") return;

		const mode = searchParams.get("mode") === "blitz" ? "blitz" : "prime";
		const minutes = parseInt(searchParams.get("minutes") || "1", 10); // Match new default

		dispatch({
			type: "START_GAME",
			payload: {
				mode,
				duration: mode === "blitz" ? 1 : minutes,
			},
		});

		nextQuestion(1);
	}, [searchParams, dispatch, nextQuestion, state.status]);

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

	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

	const handleAnswer = useCallback(
		(selected: number) => {
			if (!question || selectedAnswer !== null) return;

			setSelectedAnswer(selected);
			const isCorrect = selected === question.answer;

			// Haptic feedback logic
			if (settings.hapticsEnabled && navigator.vibrate) {
				navigator.vibrate(isCorrect ? 5 : [50, 50, 50]);
			}

			// Update state immediately for stats/timer
			dispatch({
				type: "ANSWER_QUESTION",
				payload: {
					id: crypto.randomUUID(),
					isCorrect,
					points: isCorrect ? 10 * state.difficulty : 0,
					equation: question.equation,
					correctAnswer: question.answer,
					selectedAnswer: selected,
					timestamp: Date.now(),
				},
			});

			// Delay the transition to next question to show feedback
			setTimeout(
				() => {
					const newDifficulty =
						isCorrect && (state.streak + 1) % 5 === 0
							? Math.min(state.difficulty + 1, 10)
							: state.difficulty;

					setSelectedAnswer(null);
					nextQuestion(newDifficulty);
				},
				isCorrect ? 100 : 250,
			);
		},
		[
			question,
			selectedAnswer,
			state.difficulty,
			state.streak,
			dispatch,
			nextQuestion,
			settings.hapticsEnabled,
		],
	);

	return {
		state,
		question,
		options,
		disabledOptions,
		isFrozen,
		selectedAnswer,
		setIsFrozen,
		setDisabledOptions,
		nextQuestion,
		handleAnswer,
		dispatch,
	};
};
