import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/Button";
import { Lifelines } from "@/components/Lifelines";
import { useGameLogic } from "@/hooks/useGameLogic";

export const Game = () => {
	// Remove unused navigate
	const {
		state,
		question,
		options,
		disabledOptions,
		setIsFrozen,
		setDisabledOptions,
		nextQuestion,
		dispatch,
	} = useGameLogic();
	// The hook handles navigation on finish, so we might not need it here unless for UI actions.

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

		// Difficulty scaling
		const newDifficulty =
			isCorrect && (state.streak + 1) % 5 === 0
				? Math.min(state.difficulty + 1, 10)
				: state.difficulty;

		nextQuestion(newDifficulty);
	};

	if (!question) return null;

	return (
		<motion.div
			className="flex flex-col w-full h-full relative p-4 overflow-hidden"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			{/* Top Zone: Stats (Read-Only) */}
			<div className="flex-none pt-safe w-full flex justify-between items-start z-10">
				<div className="flex flex-col glass-panel px-4 py-2 rounded-xl">
					<span className="text-[10px] text-text-dim uppercase tracking-widest font-bold">
						Score
					</span>
					<span className="text-xl font-mono text-primary text-shadow-neon">
						{state.score}
					</span>
				</div>

				{/* Floating Timer */}
				<motion.div
					animate={{
						scale: state.timeLeft < 10 ? [1, 1.2, 1] : 1,
						textShadow:
							state.timeLeft < 10 ? "0 0 20px rgba(255, 0, 85, 0.8)" : "none",
					}}
					transition={{
						repeat: Infinity,
						duration: state.timeLeft < 10 ? 0.5 : 1,
					}}
					className={`text-3xl font-mono font-bold tracking-tight ${state.timeLeft < 10 ? "text-error" : "text-white"}`}
				>
					{Math.floor(state.timeLeft / 60)}:
					{(state.timeLeft % 60).toString().padStart(2, "0")}
				</motion.div>

				<div className="flex flex-col items-end glass-panel px-4 py-2 rounded-xl">
					<span className="text-[10px] text-text-dim uppercase tracking-widest font-bold">
						Streak
					</span>
					<span className="text-xl font-mono text-secondary text-shadow-neon">
						{state.streak}
					</span>
				</div>
			</div>

			{/* Middle Zone: The Equation (Visual Focus) */}
			<div className="flex-1 flex flex-col items-center justify-center w-full z-10 my-4">
				<AnimatePresence mode="wait">
					<motion.div
						key={question.equation}
						initial={{ opacity: 0, scale: 0.5, y: 50 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
						transition={{ type: "spring", stiffness: 300, damping: 20 }}
						className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 drop-shadow-2xl tracking-tighter text-center"
					>
						{question.equation}
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Bottom Zone: Controls (Thumb Zone) */}
			<div className="flex-none w-full flex flex-col gap-6 z-20 pb-safe">
				{/* Lifelines Bar */}
				<div className="flex justify-center w-full">
					<Lifelines
						onFiftyFifty={handleFiftyFifty}
						onSkip={handleSkip}
						onFreeze={handleFreeze}
					/>
				</div>

				{/* Answer Grid */}
				<div className="grid grid-cols-2 gap-3 w-full h-64">
					{options.map((opt, i) => (
						<Button
							key={`${question.equation}-${opt}-${i}`}
							variant="glass"
							size="xl"
							disabled={disabledOptions.includes(opt)}
							className={`h-full text-4xl font-mono transition-all active:scale-95 ${disabledOptions.includes(opt) ? "opacity-20 blur-sm" : "hover:bg-white/10 hover:border-primary/50"}`}
							onClick={() => handleAnswer(opt)}
						>
							{opt}
						</Button>
					))}
				</div>
			</div>
		</motion.div>
	);
};
