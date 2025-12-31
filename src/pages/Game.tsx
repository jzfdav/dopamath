import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/Button";
import { Lifelines } from "@/components/Lifelines";
import { useGameLogic } from "@/hooks/useGameLogic";
import { VisualTimer } from "@/components/VisualTimer";
import { ParticleBurst } from "@/components/ParticleBurst";
import { useState, useEffect } from "react";

export const Game = () => {
	const {
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
	} = useGameLogic();

	const [showParticles, setShowParticles] = useState(false);
	const [shake, setShake] = useState(false);

	// Detect correct/wrong answer for visual effects
	useEffect(() => {
		if (selectedAnswer !== null && question) {
			if (selectedAnswer === question.answer) {
				setShowParticles(true);
			} else {
				setShake(true);
				setTimeout(() => setShake(false), 400);
			}
		}
	}, [selectedAnswer, question]);

	if (!question) return null;

	const handleFreeze = () => {
		setIsFrozen(true);
		// Logic is actually handled in Lifelines button via handleUse, 
		// but we still need the props here if we want to call it manually
	};

	const handleFiftyFifty = () => {
		const wrongOptions = options.filter((opt) => opt !== question.answer);
		const toDisable = wrongOptions
			.sort(() => Math.random() - 0.5)
			.slice(0, 2);
		setDisabledOptions(toDisable);
	};

	const handleSimplify = () => {
		setIsSimplifyActive(true);
	};

	const handleSkip = () => {
		nextQuestion(state.difficulty);
	};

	return (
		<motion.div
			className="flex flex-col w-full h-full relative px-6 overflow-hidden"
			initial={{ opacity: 0 }}
			animate={{
				opacity: 1,
				x: shake ? [-10, 10, -10, 10, 0] : 0,
			}}
			transition={{ duration: shake ? 0.4 : 0.3 }}
		>
			<ParticleBurst active={showParticles} onComplete={() => setShowParticles(false)} />

			{/* Game Header */}
			<div className="flex-none pt-safe pb-4 flex items-center justify-between z-10">
				<div className="flex flex-col">
					<span className="text-[10px] text-text-dim uppercase tracking-widest font-bold">
						Score
					</span>
					<div className="flex items-center gap-2">
						<span className="text-2xl font-black text-primary drop-shadow-neon">
							{state.score}
						</span>
						{state.streak > 1 && (
							<motion.div
								initial={{ scale: 0.5, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								className="px-2 py-0.5 bg-secondary/20 border border-secondary/30 rounded-full"
							>
								<span className="text-[10px] font-black text-secondary uppercase tracking-tighter">
									{state.streak}x Combo
								</span>
							</motion.div>
						)}
					</div>
				</div>

				{/* Dynamic Visual Timer */}
				<VisualTimer
					timeLeft={state.timeLeft}
					totalTime={state.totalTime}
					isFrozen={isFrozen}
				/>

				<div className="flex flex-col items-end px-4 py-2 rounded-xl">
					<span className="text-[10px] text-text-dim uppercase tracking-widest font-bold">
						Level
					</span>
					<span className="text-xl font-black text-secondary">
						{state.difficulty}
					</span>
				</div>
			</div>

			{/* Main Question Display */}
			<div className="flex-1 flex flex-col items-center justify-center relative z-10">
				<motion.div
					key={question.equation}
					initial={{ scale: 0.8, opacity: 0, y: 20 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					className="w-full text-center px-4"
				>
					<div className={`text-6xl font-black mb-12 tracking-tighter transition-all duration-300 ${isSimplifyActive ? "scale-110 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]" : "text-white"}`}>
						{question.equation}
						{isSimplifyActive && (
							<motion.div
								animate={{ opacity: [0, 1, 0] }}
								transition={{ repeat: Infinity, duration: 1 }}
								className="mt-4 text-xs text-primary font-bold uppercase tracking-[0.5em]"
							>
								Simplified
							</motion.div>
						)}
					</div>
				</motion.div>

				{/* Answer Options Grid */}
				<div className="grid grid-cols-2 gap-4 w-full">
					<AnimatePresence mode="popLayout">
						{options.map((option, index) => {
							const isCorrect = option === question.answer;
							const isSelected = selectedAnswer === option;
							const isDisabled = disabledOptions.includes(option);

							return (
								<motion.div
									key={`${question.equation}-${option}`}
									initial={{ opacity: 0, scale: 0.9, y: 10 }}
									animate={{
										opacity: isDisabled ? 0.3 : 1,
										scale: isSelected ? 1.05 : 1,
										y: 0
									}}
									transition={{ delay: index * 0.05 }}
								>
									<Button
										variant={
											isSelected
												? isCorrect
													? "primary"
													: "danger"
												: "ghost"
										}
										size="lg"
										disabled={isDisabled || selectedAnswer !== null}
										className={`w-full h-24 text-2xl font-black rounded-3xl transition-all ${isSelected ? "ring-4 ring-white/20" : "glass-panel"
											} ${isDisabled ? "opacity-30 grayscale cursor-not-allowed" : ""}`}
										onClick={() => handleAnswer(option)}
									>
										{option}
									</Button>
								</motion.div>
							);
						})}
					</AnimatePresence>
				</div>
			</div>

			{/* UI Footer */}
			<div className="flex-none pt-4 pb-safe z-10">
				<Lifelines
					onFreeze={handleFreeze}
					onFiftyFifty={handleFiftyFifty}
					onSimplify={handleSimplify}
					onSkip={handleSkip}
				/>
			</div>
		</motion.div>
	);
};
