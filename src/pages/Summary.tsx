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
			state.answersAttempted,
			0, // state.correctCount (Pending Context Update)
			state.totalTime / 60,
		);
	}, [
		state.score,
		state.mode,
		state.totalTime,
		state.status,
		state.answersAttempted,
		navigate,
	]);

	const accuracy =
		state.answersAttempted > 0
			? Math.round((state.score / (state.answersAttempted * 10)) * 100)
			: 0;

	const handleHome = () => {
		dispatch({ type: "END_GAME" }); // Functionally reset or just leave
		navigate("/");
	};

	const handlePlayAgain = () => {
		// Replay same settings?
		// Basic restart logic:
		dispatch({
			type: "START_GAME",
			payload: { mode: state.mode, duration: state.totalTime / 60 },
		});
		navigate("/game");
	};

	if (state.status !== "finished") return null;

	return (
		<div className="flex flex-col w-full h-full relative p-6 overflow-hidden">
			{/* Background Texture */}
			<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

			{/* Top: Celebration */}
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className="flex-1 flex flex-col items-center justify-center w-full z-10"
			>
				<span className="text-text-dim tracking-[0.5em] uppercase text-xs mb-6">
					Session Complete
				</span>

				<div className="relative mb-12 flex flex-col items-center">
					<h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary filter drop-shadow-neon tracking-tighter">
						{state.score}
					</h1>
					{isNewRecord && (
						<motion.div
							initial={{ y: 20, opacity: 0, rotate: -10 }}
							animate={{ y: 0, opacity: 1, rotate: 12 }}
							className="absolute -top-8 -right-8 bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg border border-white/20"
						>
							NEW BEST!
						</motion.div>
					)}
				</div>

				<div className="grid grid-cols-2 gap-4 w-full max-w-xs">
					<div className="flex flex-col items-center p-4 glass-panel rounded-2xl">
						<span className="text-text-dim text-[10px] mb-1 uppercase tracking-wider">
							Best Score
						</span>
						<span className="text-xl font-mono text-white">{bestScore}</span>
					</div>
					<div className="flex flex-col items-center p-4 glass-panel rounded-2xl">
						<span className="text-text-dim text-[10px] mb-1 uppercase tracking-wider">
							Total Qs
						</span>
						<span className="text-xl font-mono text-secondary">
							{state.answersAttempted}
						</span>
					</div>
					<div className="flex flex-col items-center p-4 glass-panel rounded-2xl col-span-2">
						<span className="text-text-dim text-[10px] mb-1 uppercase tracking-wider">
							Accuracy (Est.)
						</span>
						<span
							className={`text-xl font-mono ${accuracy > 80 ? "text-primary" : "text-white"}`}
						>
							{accuracy}%
						</span>
					</div>
				</div>
			</motion.div>

			{/* Bottom: Actions */}
			<div className="flex-none w-full flex flex-col gap-3 z-20 pb-safe">
				<Button
					variant="neon"
					size="xl"
					onClick={handlePlayAgain}
					className="w-full flex items-center justify-center gap-3 h-16 text-lg"
				>
					<RotateCcw size={20} />
					Play Again
				</Button>
				<Button
					variant="ghost"
					onClick={handleHome}
					className="w-full flex items-center justify-center gap-2 text-text-dim hover:text-white"
				>
					<HomeIcon size={18} />
					Return Home
				</Button>
			</div>
		</div>
	);
};
