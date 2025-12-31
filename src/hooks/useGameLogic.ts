import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	type ContentMode,
	type GameMode,
	useGame,
} from "@/context/GameContext";
import { useFeedback } from "./useFeedback";
import { generateEquation, generateOptions } from "@/utils/math";

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
			setSelectedAnswer(null);
			setIsTransitioning(false);
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

		const q = generateEquation(1, contentMode);
		setQuestion(q);
		setOptions(generateOptions(q.answer));
	}, [searchParams, dispatch, state.status]);

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
		(answer: number) => {
			if (!question || selectedAnswer !== null || isTransitioning) return;

			setSelectedAnswer(answer);
			setIsTransitioning(true);
			const isCorrect = answer === question.answer;

			if (isCorrect) {
				success();
			} else {
				error();
				if (state.lifelines.secondChance) {
					dispatch({
						type: "USE_LIFELINE",
						payload: { name: "secondChance" },
					});

					// Recovery path: treat as correct but with half points and slight delay
					setTimeout(() => {
						const points = Math.floor(5 * state.difficulty);
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
							},
						});

						// In recovery, we don't increment difficulty unless they were already due
						const nextDiff = (state.streak + 1) % 5 === 0
							? Math.min(state.difficulty + 1, 10)
							: state.difficulty;

						nextQuestion(nextDiff);
					}, 400);
					return;
				}
			}

			const delay = isCorrect ? 150 : 400;
			setTimeout(() => {
				dispatch({
					type: "ANSWER_QUESTION",
					payload: {
						id: crypto.randomUUID(),
						isCorrect,
						points: isCorrect ? 10 * state.difficulty : 0,
						equation: question.equation,
						correctAnswer: question.answer,
						selectedAnswer: answer,
						timestamp: Date.now(),
					},
				});

				const newDifficulty =
					isCorrect && (state.streak + 1) % 5 === 0
						? Math.min(state.difficulty + 1, 10)
						: state.difficulty;

				nextQuestion(newDifficulty);
			}, delay);
		},
		[question, selectedAnswer, isTransitioning, state.lifelines.secondChance, state.difficulty, state.streak, dispatch, success, error, nextQuestion],
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
