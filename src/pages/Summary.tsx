import { motion } from "framer-motion";
import { HomeIcon, RotateCcw, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Button } from "@/components/Button";
import { useGame } from "@/context/GameContext";
import { getBestScore, saveGameResult } from "@/utils/storage";

export const Summary = () => {
	const { state, dispatch } = useGame();
	const navigate = useNavigate();
	const [bestScore, setBestScore] = useState(0);
	const [isNewRecord, setIsNewRecord] = useState(false);

	const hasSaved = useRef(false);

	useEffect(() => {
		if (state.status !== "finished") {
			// If accessed directly without finishing game, redirect home
			navigate("/");
			return;
		}

		if (hasSaved.current) return;

		const prevBest = getBestScore(state.mode);
		setBestScore(prevBest);

		if (state.score > prevBest) {
			setIsNewRecord(true);
			setBestScore(state.score);
		}

		// Save Result
		saveGameResult({
			score: state.score,
			mode: state.mode,
			correctAnswers: state.correctAnswers,
			answersAttempted: state.answersAttempted,
			timestamp: Date.now(),
		});

		hasSaved.current = true;
	}, [
		state.score,
		state.mode,
		state.answersAttempted,
		state.correctAnswers,
		state.status,
		navigate,
	]);

	const chartData = useMemo(() => {
		return state.history.map((item, index) => ({
			name: index + 1,
			score: item.scoreAfter,
		}));
	}, [state.history]);

	if (state.status !== "finished") return null;

	const accuracy =
		state.answersAttempted > 0
			? Math.round((state.correctAnswers / state.answersAttempted) * 100)
			: 0;

	const handleHome = () => {
		dispatch({ type: "END_GAME" });
		navigate("/");
	};

	const handlePlayAgain = () => {
		dispatch({ type: "END_GAME" });

		// Reconstruct search params to preserve settings
		const params = new URLSearchParams();
		params.set("mode", state.mode);
		params.set("content", state.contentMode);
		params.set("minutes", (state.totalTime / 60).toString());

		navigate(`/game?${params.toString()}`);
	};

	return (
		<motion.div
			className="flex flex-col w-full h-full relative p-6 overflow-hidden"
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 1.05 }}
			transition={{ duration: 0.4 }}
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className="flex-1 flex flex-col items-center justify-center w-full z-10"
			>
				<span className="text-text-dim tracking-[0.5em] uppercase text-xs mb-6">
					Session Complete
				</span>

				<div className="relative mb-12 flex flex-col items-center px-6">
					<h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary filter drop-shadow-neon leading-none">
						{state.score}
					</h1>
					{isNewRecord && (
						<motion.div
							initial={{ y: 20, opacity: 0, rotate: -10 }}
							animate={{ y: 0, opacity: 1, rotate: 12 }}
							className="absolute -top-8 -right-8 bg-secondary text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg border border-white/20 whitespace-nowrap"
						>
							NEW BEST!
						</motion.div>
					)}
				</div>

				<div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
					<div className="glass-panel p-4 rounded-2xl flex flex-col items-center">
						<span className="text-[10px] text-text-dim uppercase tracking-widest font-bold mb-1">
							Accuracy
						</span>
						<span
							className={`text-xl font-mono ${accuracy > 80 ? "text-primary" : "text-white"}`}
						>
							{accuracy}%
						</span>
					</div>
					<div className="glass-panel p-4 rounded-2xl flex flex-col items-center">
						<span className="text-[10px] text-text-dim uppercase tracking-widest font-bold mb-1 opacity-60">
							Best
						</span>
						<span className="text-xl font-mono text-white">{bestScore}</span>
					</div>
				</div>

				{chartData.length > 0 && (
					<div className="w-full max-w-sm h-40 glass-panel p-4 rounded-2xl mb-8 flex flex-col">
						<div className="flex items-center gap-2 mb-2">
							<TrendingUp size={14} className="text-primary" />
							<span className="text-[10px] text-text-dim uppercase tracking-widest font-bold">
								Session Trend
							</span>
						</div>
						<div className="flex-1 w-full min-h-0">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={chartData}>
									<defs>
										<linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3} />
											<stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
										</linearGradient>
									</defs>
									<XAxis dataKey="name" hide />
									<YAxis hide domain={[0, "auto"]} />
									<Tooltip
										contentStyle={{
											backgroundColor: "rgba(0,0,0,0.8)",
											border: "1px solid rgba(0,255,157,0.2)",
											borderRadius: "8px",
											fontSize: "12px",
										}}
										itemStyle={{ color: "#00ff9d" }}
									/>
									<Area
										type="monotone"
										dataKey="score"
										stroke="#00ff9d"
										fillOpacity={1}
										fill="url(#colorScore)"
										strokeWidth={2}
										dot={false}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</div>
				)}
			</motion.div>

			<div className="flex-none w-full max-w-sm mx-auto flex flex-col gap-3 z-20 pb-safe">
				<Button
					variant="neon"
					size="xl"
					onClick={handlePlayAgain}
					className="w-full flex items-center justify-center gap-3 h-14 text-lg"
				>
					<RotateCcw size={18} />
					Play Again
				</Button>
				<Button
					variant="ghost"
					onClick={handleHome}
					className="w-full flex items-center justify-center gap-2 text-text-dim hover:text-white"
				>
					<HomeIcon size={16} />
					Return Home
				</Button>
			</div>
		</motion.div>
	);
};
