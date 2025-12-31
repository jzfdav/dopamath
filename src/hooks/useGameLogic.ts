import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GAME_CONFIG } from "@/config/gameConfig";
import {
	type ContentMode,
	type GameMode,
	useGame,
} from "@/context/GameContext";
import { generateEquation, generateOptions } from "@/utils/math";
import { useFeedback } from "./useFeedback";

export const useGameLogic = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { state, dispatch } = useGame();
	const { success, error } = useFeedback();

	const [question, setQuestion] = useState<{
		equation: string;
		answer: number;
	} | null>(null);
	const [options, setOptions] = useState<number[]>([]);
	const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
	const [isFrozen, setIsFrozen] = useState(false);
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [isSimplifyActive, setIsSimplifyActive] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);

	// Pause game on tab hide
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden" && state.status === "playing") {
				dispatch({ type: "PAUSE_GAME" });
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () =>
			document.removeEventListener("visibilitychange", handleVisibilityChange);
	}, [state.status, dispatch]);

	// Check for game over
	useEffect(() => {
		if (state.status === "finished") {
			navigate("/summary");
		}
	}, [state.status, navigate]);

	const nextQuestion = useCallback(
		(difficulty: number) => {
			const newQuestion = generateEquation(difficulty, state.contentMode);
			setQuestion(newQuestion);
			setOptions(generateOptions(newQuestion.answer, GAME_CONFIG.OPTION_COUNT));
			setDisabledOptions([]);
			setIsFrozen(false);
			setIsSimplifyActive(false);
			setSelectedAnswer(null);
			setIsTransitioning(false);
		},
		[state.contentMode],
	);

	// Init game
	useEffect(() => {
		if (state.status !== "idle") return;

		const mode = (searchParams.get("mode") as GameMode) || "prime";
		const contentMode = (searchParams.get("content") as ContentMode) || "mixed";
		const minutes =
			Number(searchParams.get("minutes")) ||
			GAME_CONFIG.DEFAULT_SESSION_MINUTES;

		dispatch({
			type: "START_GAME",
			payload: {
				mode,
				contentMode,
				duration: minutes,
			},
		});

		const q = generateEquation(GAME_CONFIG.MIN_DIFFICULTY, contentMode);
		setQuestion(q);
		setOptions(generateOptions(q.answer, GAME_CONFIG.OPTION_COUNT));
	}, [searchParams, dispatch, state.status]);

	// Timer Loop
	useEffect(() => {
		if (state.status !== "playing") return;

		const timer = setInterval(() => {
			if (!isFrozen) {
				dispatch({ type: "TICK_TIMER" });
			}
		}, GAME_CONFIG.TICK_INTERVAL_MS);

		return () => clearInterval(timer);
	}, [isFrozen, state.status, dispatch]);

	const handleAnswer = useCallback(
		(answer: number) => {
			if (!question || selectedAnswer !== null || isTransitioning) return;

			setSelectedAnswer(answer);
			setIsTransitioning(true);
			const isCorrect = answer === question.answer;

			if (isCorrect) {
				success();
				if (state.timeLeft <= GAME_CONFIG.CLUTCH_THRESHOLD_SECONDS) {
					dispatch({
						type: "ADD_TIME",
						payload: { seconds: GAME_CONFIG.GRACE_PERIOD_SECONDS },
					});
				}
			} else {
				error();
				if (state.lifelines.secondChance) {
					dispatch({
						type: "USE_LIFELINE",
						payload: { name: "secondChance" },
					});

					// Recovery path: treat as correct but with half points and slight delay
					setTimeout(() => {
						const points = Math.floor(
							(GAME_CONFIG.BASE_POINTS / 2) * state.difficulty,
						);

						// In recovery, we don't change difficulty
						const currentDifficulty = state.difficulty;

						dispatch({
							type: "ANSWER_QUESTION",
							payload: {
								id: crypto.randomUUID(),
								isCorrect: true,
								points,
								equation: question.equation,
								correctAnswer: question.answer,
								selectedAnswer: answer,
								timestamp: Date.now(),
								newDifficulty: currentDifficulty,
							},
						});

						nextQuestion(currentDifficulty);
					}, GAME_CONFIG.TRANSITION_DELAY_WRONG_MS);
					return;
				}
			}

			const delay = isCorrect
				? GAME_CONFIG.TRANSITION_DELAY_CORRECT_MS
				: GAME_CONFIG.TRANSITION_DELAY_WRONG_MS;
			setTimeout(() => {
				// Calculate new difficulty
				let newDifficulty = state.difficulty;

				if (isCorrect) {
					// Increase difficulty every X correct answers
					if ((state.streak + 1) % GAME_CONFIG.STREAK_DIFFICULTY_STEP === 0) {
						newDifficulty = Math.min(
							state.difficulty + 1,
							GAME_CONFIG.MAX_DIFFICULTY,
						);
					}
				} else {
					// Decrease difficulty if we fail 2 in a row (current failure makes streak 0, but we can track consecutive failures if needed)
					// For now, let's just be simple: if they fail, we don't drop immediately unless we want to be nice.
					// Let's implement a simple "drop if difficulty > 1" logic on wrong answer to prevent getting stuck
					// Actually, the plan said "decrement on repeated wrong answers".
					// Since tracking "consecutive wrong" isn't in state, we'll do a simpler version:
					// If difficulty > 1 and they get it wrong, we can be lenient next time.
					// But let's stick to the plan: fair manner.
					// If streak is already 0 (meaning previous was also wrong), decrement.
					if (state.streak === 0 && state.difficulty > 1) {
						newDifficulty = Math.max(1, state.difficulty - 1);
					}
				}

				dispatch({
					type: "ANSWER_QUESTION",
					payload: {
						id: crypto.randomUUID(),
						isCorrect,
						points: isCorrect ? GAME_CONFIG.BASE_POINTS * state.difficulty : 0,
						equation: question.equation,
						correctAnswer: question.answer,
						selectedAnswer: answer,
						timestamp: Date.now(),
						newDifficulty,
					},
				});

				nextQuestion(newDifficulty);
			}, delay);
		},
		[
			question,
			selectedAnswer,
			isTransitioning,
			state.lifelines.secondChance,
			state.difficulty,
			state.streak,
			state.timeLeft,
			dispatch,
			success,
			error,
			nextQuestion,
		],
	);

	return {
		state,
		question,
		options,
		disabledOptions,
		isFrozen,
		isSimplifyActive,
		selectedAnswer,
		setIsFrozen,
		setIsSimplifyActive,
		setDisabledOptions,
		nextQuestion,
		handleAnswer,
		dispatch,
	};
};
