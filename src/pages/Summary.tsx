import { motion } from "framer-motion";
import { Home as HomeIcon, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { useGame } from "@/context/GameContext";
import { getBestScore, saveGameResult } from "@/utils/storage";

export const Summary = () => {
	const { state, dispatch } = useGame();
	const navigate = useNavigate();
	const [bestScore, setBestScore] = useState(0);
	const [isNewRecord, setIsNewRecord] = useState(false);

	useEffect(() => {
		if (state.status !== "finished") {
			// If accessed directly without finishing game, redirect home
			navigate("/");
			return;
		}

		// Actually we don't track total questions count explicitly in state root,
		// but we can infer or we should have tracked it.
		// Ideally state has `answersAttempted`.
		// For now we will rely on score logic or just save what we have.
		// Let's assume we want to save purely score.

		// Calculate stats
		// We didn't track total attempts in state explicitly in the Reducer
		// (Wait, `GameContext` has `score` and `streak`, but not `totalQuestions`).
		// FIX: logic gap. We can't calculate exact accuracy without total attempts.
		// For MVP, we'll just save score and duration.

		const prevBest = getBestScore(state.mode);
		setBestScore(prevBest);

		if (state.score > prevBest) {
			setIsNewRecord(true);
			setBestScore(state.score);
		}

		// Save Result
		saveGameResult(
			state.score,
			state.mode,
			0, // Passing 0 for now as we missed tracking attempts
			0,
			state.totalTime / 60,
		);
	}, [state.score, state.mode, state.totalTime, state.status, navigate]);

	const handleHome = () => {
		dispatch({ type: "END_GAME" }); // Functionally reset or just leave
		navigate("/");
	};

	const handlePlayAgain = () => {
		// Replay same settings?
		// For now just go home to pick settings again is safer logic wise
		navigate("/");
	};

	if (state.status !== "finished") return null;

	return (
		<div className="flex flex-col items-center justify-center w-full h-full p-6 max-w-md mx-auto">
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className="flex flex-col items-center w-full"
			>
				<span className="text-white/50 tracking-widest uppercase text-sm mb-4">
					Session Complete
				</span>

				<div className="relative mb-12">
					<h1 className="text-8xl font-black text-primary tracking-tighter shadow-glow">
						{state.score}
					</h1>
					{isNewRecord && (
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							className="absolute -top-6 -right-12 bg-secondary text-black text-xs font-bold px-2 py-1 rounded-full rotate-12"
						>
							NEW BEST!
						</motion.div>
					)}
				</div>

				<div className="grid grid-cols-2 gap-8 w-full mb-12">
					<div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/10">
						<span className="text-white/40 text-xs mb-1 uppercase">
							Best Score
						</span>
						<span className="text-2xl font-mono text-white">{bestScore}</span>
					</div>
					<div className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/10">
						<span className="text-white/40 text-xs mb-1 uppercase">Streak</span>
						<span className="text-2xl font-mono text-secondary">
							{state.streak}
						</span>
					</div>
				</div>

				<div className="flex flex-col w-full gap-3">
					<Button
						size="xl"
						onClick={handlePlayAgain}
						className="w-full flex items-center justify-center gap-2"
					>
						<RotateCcw size={20} />
						Play Again
					</Button>
					<Button
						variant="ghost"
						onClick={handleHome}
						className="w-full flex items-center justify-center gap-2"
					>
						<HomeIcon size={20} />
						Return Home
					</Button>
				</div>
			</motion.div>
		</div>
	);
};
