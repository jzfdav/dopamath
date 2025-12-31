import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/Button";
import { Lifelines } from "@/components/Lifelines";
import { useGame } from "@/context/GameContext";
import { generateEquation, generateOptions } from "@/utils/math";

export const Game = () => {
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
			navigate("/summary"); // We will build this later
		}
	}, [state.status, navigate]);

	const nextQuestion = useCallback((difficulty: number) => {
		const q = generateEquation(difficulty);
		setQuestion(q);
		setOptions(generateOptions(q.answer));
		setDisabledOptions([]); // Reset disabled
		setIsFrozen(false); // Unfreeze if frozen (optional design choice, usually per Q or strict duration)
	}, []);

	// init game
	useEffect(() => {
		const mode = searchParams.get("mode") === "blitz" ? "blitz" : "prime";
		const minutes = parseInt(searchParams.get("minutes") || "2", 10);

		dispatch({
			type: "START_GAME",
			payload: {
				mode,
				duration: mode === "blitz" ? 1 : minutes, // 1 min for blitz, else prime
			},
		});

		nextQuestion(1);

		const timer = setInterval(() => {
			if (!isFrozen) {
				dispatch({ type: "TICK_TIMER" });
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [searchParams, dispatch, nextQuestion, isFrozen]);

	const handleFiftyFifty = () => {
		if (!question) return;
		const wrongOptions = options.filter((opt) => opt !== question.answer);
		// Disable 2 random wrong options
		const toDisable = wrongOptions.sort(() => Math.random() - 0.5).slice(0, 2);
		setDisabledOptions(toDisable);
	};

	const handleSkip = () => {
		nextQuestion(state.difficulty);
	};

	const handleFreeze = () => {
		setIsFrozen(true);
		setTimeout(() => setIsFrozen(false), 10000); // 10s freeze
	};

	const handleAnswer = (selected: number) => {
		if (!question) return;

		const isCorrect = selected === question.answer;

		// Haptic feedback logic here usually
		if (navigator.vibrate) {
			navigator.vibrate(isCorrect ? 5 : [50, 50, 50]);
		}

		dispatch({
			type: "ANSWER_QUESTION",
			payload: { isCorrect, points: isCorrect ? 10 * state.difficulty : 0 },
		});

		// Progression logic (simple for now)
		// If correct and streak is high, increase difficulty?
		// For now just consistent difficulty based on something?
		// Let's just keep it random scaling or based on score.
		// Simplifying: Increase difficulty every 5 streak
		const newDifficulty =
			isCorrect && (state.streak + 1) % 5 === 0
				? Math.min(state.difficulty + 1, 10)
				: state.difficulty;

		nextQuestion(newDifficulty);
	};

	if (!question) return null;

	return (
		<div className="flex flex-col items-center justify-between w-full h-full p-4 max-w-md mx-auto relative overflow-hidden">
			{/* HUD */}
			<div className="w-full flex justify-between items-end mb-8 pt-4">
				<div className="flex flex-col">
					<span className="text-xs text-white/50 uppercase tracking-widest">
						Score
					</span>
					<span className="text-2xl font-mono text-primary">{state.score}</span>
				</div>

				<div className="flex flex-col items-center">
					{/* Timer Pulse Effect */}
					<motion.div
						animate={{ scale: state.timeLeft < 10 ? [1, 1.1, 1] : 1 }}
						transition={{ repeat: Infinity, duration: 1 }}
						className={`text-4xl font-mono font-bold ${state.timeLeft < 10 ? "text-error" : "text-white"}`}
					>
						{Math.floor(state.timeLeft / 60)}:
						{(state.timeLeft % 60).toString().padStart(2, "0")}
					</motion.div>
				</div>

				<div className="flex flex-col items-end">
					<span className="text-xs text-white/50 uppercase tracking-widest">
						Streak
					</span>
					<span className="text-2xl font-mono text-secondary">
						{state.streak}
					</span>
				</div>
			</div>

			{/* Equation */}
			<div className="flex-1 flex flex-col items-center justify-center w-full mb-8">
				<AnimatePresence mode="wait">
					<motion.div
						key={question.equation} // Trigger animation on new question
						initial={{ opacity: 0, y: 20, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -20, scale: 1.1 }}
						className="text-6xl font-black text-white tracking-tight"
					>
						{question.equation}
					</motion.div>
				</AnimatePresence>
			</div>

			<Lifelines
				onFiftyFifty={handleFiftyFifty}
				onSkip={handleSkip}
				onFreeze={handleFreeze}
			/>

			{/* Inputs */}
			<div className="w-full grid grid-cols-2 gap-4 pb-8">
				{options.map((opt, i) => (
					<Button
						key={`${question.equation}-${opt}-${i}`}
						variant="outline"
						size="xl"
						disabled={disabledOptions.includes(opt)}
						className="h-24 text-4xl border-white/10 bg-white/5 active:bg-white/20 disabled:opacity-10 disabled:pointer-events-none"
						onClick={() => handleAnswer(opt)}
					>
						{opt}
					</Button>
				))}
			</div>
		</div>
	);
};
