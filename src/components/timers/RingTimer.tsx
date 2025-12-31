import { motion } from "framer-motion";
import type { TimerProps } from "./types";

export const RingTimer = ({ timeLeft, totalTime, className }: TimerProps) => {
	const progress = timeLeft / totalTime;
	const radius = 20;
	const circumference = 2 * Math.PI * radius;

	return (
		<div className={`relative flex items-center gap-4 ${className}`}>
			<div className="relative w-14 h-14 flex items-center justify-center">
				<svg width="56" height="56" className="rotate-[-90deg]">
					<title>Ring Timer</title>
					<circle
						cx="28"
						cy="28"
						r={radius}
						fill="none"
						stroke="white"
						strokeWidth="4"
						opacity="0.1"
					/>
					<motion.circle
						cx="28"
						cy="28"
						r={radius}
						fill="none"
						stroke={
							timeLeft < 10 ? "var(--color-error)" : "var(--color-primary)"
						}
						strokeWidth="4"
						strokeDasharray={circumference}
						animate={{ strokeDashoffset: circumference * (1 - progress) }}
						strokeLinecap="round"
						className="drop-shadow-neon"
						transition={{ type: "spring", stiffness: 100, damping: 20 }}
					/>
				</svg>
				<span
					className={`absolute text-[10px] font-mono font-bold ${timeLeft < 10 ? "text-error" : "text-white"}`}
				>
					{timeLeft}s
				</span>
			</div>

			<div className="flex flex-col">
				<span
					className={`text-xl font-mono font-bold ${timeLeft < 10 ? "text-error" : "text-white"}`}
				>
					{Math.floor(timeLeft / 60)}:
					{(timeLeft % 60).toString().padStart(2, "0")}
				</span>
			</div>
		</div>
	);
};
