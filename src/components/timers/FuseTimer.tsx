import { motion } from "framer-motion";
import type { TimerProps } from "./types";

export const FuseTimer = ({ timeLeft, totalTime, className }: TimerProps) => {
	const progress = timeLeft / totalTime;

	return (
		<div
			className={`relative w-full max-w-[200px] flex flex-col items-center gap-2 ${className}`}
		>
			<div className="relative w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
				{/* The Fuse Rope */}
				<div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#333,#333_2px,#222_2px,#222_4px)]" />

				{/* The Burned Part */}
				<motion.div
					className="absolute top-0 bottom-0 left-0 bg-black/60"
					animate={{ width: `${(1 - progress) * 100}%` }}
					transition={{ ease: "linear", duration: 0.5 }}
				/>

				{/* The Spark */}
				{timeLeft > 0 && (
					<motion.div
						className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_15px_#fbbf24]"
						animate={{
							left: `${(1 - progress) * 100}%`,
							scale: [1, 1.5, 1],
							boxShadow: [
								"0 0 10px #fbbf24",
								"0 0 25px #f59e0b",
								"0 0 10px #fbbf24",
							],
						}}
						transition={{
							left: { ease: "linear", duration: 0.5 },
							scale: { repeat: Infinity, duration: 0.1 },
							boxShadow: { repeat: Infinity, duration: 0.1 },
						}}
					>
						{/* Sparkles */}
						<div className="absolute inset-0">
							{[0, 1, 2].map((i) => (
								<motion.div
									key={i}
									className="absolute w-1 h-1 bg-orange-500 rounded-full"
									animate={{
										x: [0, (Math.random() - 0.5) * 30],
										y: [0, (Math.random() - 0.5) * 30],
										opacity: [1, 0],
									}}
									transition={{
										repeat: Infinity,
										duration: 0.3,
										delay: i * 0.1,
									}}
								/>
							))}
						</div>
					</motion.div>
				)}
			</div>

			<span
				className={`text-xl font-mono font-black ${timeLeft < 10 ? "text-error" : "text-white"}`}
			>
				{Math.floor(timeLeft / 60)}:
				{(timeLeft % 60).toString().padStart(2, "0")}
			</span>
		</div>
	);
};
