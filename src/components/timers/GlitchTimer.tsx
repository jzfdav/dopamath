import { motion } from "framer-motion";
import type { TimerProps } from "./types";

export const GlitchTimer = ({ timeLeft, className }: TimerProps) => {
	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;

	const glitchAnim = {
		x: timeLeft < 10 ? [-2, 2, -1, 1, 0] : 0,
		y: timeLeft < 10 ? [1, -1, 2, -2, 0] : 0,
		filter:
			timeLeft < 10
				? [
						"hue-rotate(0deg) contrast(100%)",
						"hue-rotate(90deg) contrast(200%)",
						"hue-rotate(-90deg) contrast(150%)",
						"hue-rotate(0deg) contrast(100%)",
					]
				: "none",
	};

	return (
		<div className={`relative ${className}`}>
			<motion.div
				animate={glitchAnim}
				transition={{ repeat: Infinity, duration: 0.2 }}
				className={`text-3xl font-mono font-black italic tracking-tighter ${timeLeft < 10 ? "text-error" : "text-white"}`}
			>
				{minutes.toString().padStart(2, "0")}
				<span className="animate-pulse">:</span>
				{seconds.toString().padStart(2, "0")}
			</motion.div>

			{/* Ghost Layers */}
			{timeLeft < 10 && (
				<>
					<motion.div
						animate={{ x: [-5, 5, -5], opacity: [0, 0.5, 0] }}
						transition={{ repeat: Infinity, duration: 0.1 }}
						className="absolute inset-0 text-3xl font-mono font-black italic tracking-tighter text-cyan-400 mix-blend-screen"
					>
						{minutes.toString().padStart(2, "0")}:
						{seconds.toString().padStart(2, "0")}
					</motion.div>
					<motion.div
						animate={{ x: [5, -5, 5], opacity: [0, 0.5, 0] }}
						transition={{ repeat: Infinity, duration: 0.15 }}
						className="absolute inset-0 text-3xl font-mono font-black italic tracking-tighter text-magenta mix-blend-screen"
					>
						{minutes.toString().padStart(2, "0")}:
						{seconds.toString().padStart(2, "0")}
					</motion.div>
				</>
			)}
		</div>
	);
};
