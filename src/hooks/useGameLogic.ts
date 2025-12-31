import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	type ContentMode,
	type GameMode,
	useGame,
} from "@/context/GameContext";
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
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [isSimplifyActive, setIsSimplifyActive] = useState(false);

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
			setOptions(generateOptions(newQuestion.answer));
			setDisabledOptions([]);
			setIsFrozen(false);
			setIsSimplifyActive(false);
		},
		[state.contentMode],
	);

	// Init game
	useEffect(() => {
		if (state.status === "playing" || state.status === "paused") return;

		const mode = (searchParams.get("mode") as GameMode) || "prime";
		const contentMode = (searchParams.get("content") as ContentMode) || "mixed";
		const minutes = Number(searchParams.get("minutes")) || 1;

		dispatch({
			type: "START_GAME",
			payload: {
				mode,
				contentMode,
				duration: minutes,
			},
		});

		// Generate first question
		const q = generateEquation(1, contentMode);
		setQuestion(q);
		setOptions(generateOptions(q.answer));
	}, [searchParams, dispatch, state.status]); // Included missing dependencies

	// Timer Loop
	useEffect(() => {
		if (state.status !== "playing") return;

		const timer = setInterval(() => {
			if (!isFrozen) {
				dispatch({ type: "TICK_TIMER" });
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [isFrozen, state.status, dispatch]);

	const handleAnswer = useCallback(
		(selected: number) => {
			if (!question || selectedAnswer !== null) return;

			const isCorrect = selected === question.answer;

			// Handle Second Chance
			if (!isCorrect && state.lifelines.secondChance) {
				if (navigator.vibrate) navigator.vibrate([10, 50, 10]);

				dispatch({
					type: "USE_LIFELINE",
					payload: { name: "secondChance" },
				});

				dispatch({
					type: "ANSWER_QUESTION",
					payload: {
						id: crypto.randomUUID(),
						isCorrect: true, // Streak maintained
						points: Math.floor(5 * state.difficulty),
						equation: question.equation,
						correctAnswer: question.answer,
						selectedAnswer: selected,
						timestamp: Date.now(),
					},
				});

				setSelectedAnswer(selected);
				setTimeout(() => {
					setSelectedAnswer(null);
					nextQuestion(state.difficulty);
				}, 250);
				return;
			}

			setSelectedAnswer(selected);

			if (settings.hapticsEnabled && navigator.vibrate) {
				navigator.vibrate(isCorrect ? 5 : [50, 50, 50]);
			}

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
			state.lifelines.secondChance,
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
