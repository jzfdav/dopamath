import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { TimeSelector } from "@/components/TimeSelector";

const PRIME_INTERVALS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

export const Home = () => {
	const navigate = useNavigate();
	const [selectedTime, setSelectedTime] = useState(2); // Default to 2 minutes

	const handleUrgeKiller = () => {
		// Start game with selected time (Treat Urge Killer as "Start Selected")
		navigate(`/game?mode=prime&minutes=${selectedTime}`);
	};

	const handlePrimeSelect = (minutes: number) => {
		setSelectedTime(minutes);
		// Don't navigate immediately on wheel select
	};

	return (
		<motion.div
			className="flex flex-col w-full h-full relative px-6 overflow-hidden"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			transition={{ duration: 0.3 }}
		>
			{/* Hero Section (Takes remaining space) */}
			<div className="flex-1 flex flex-col items-center justify-center w-full z-10">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5, type: "spring" }}
					className="flex flex-col items-center"
				>
					<h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary neon-text tracking-tighter mb-4 text-center leading-[0.9]">
						DOPA
						<br />
						MATH
					</h1>
					<p className="text-text-dim text-xs uppercase tracking-[0.4em] opacity-60">
						Dopamine Re-Engineered
					</p>
				</motion.div>
			</div>

			{/* Thumb Zone Section (Anchored to bottom) */}
			<div className="flex-none flex flex-col justify-end gap-8 w-full z-20 pb-4 pt-4">
				{/* Time Selector Wheel */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-center">
						<span className="text-[10px] text-primary/50 uppercase tracking-[0.2em] font-bold">
							Session Duration
						</span>
					</div>

					<TimeSelector
						options={PRIME_INTERVALS}
						selected={selectedTime} // We need state for this
						onSelect={handlePrimeSelect}
					/>
				</div>

				{/* Primary CTA */}
				<motion.div
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{
						delay: 0.3,
						type: "spring",
						stiffness: 200,
						damping: 20,
					}}
				>
					<Button
						variant="primary"
						size="xl"
						className="w-full h-20 text-2xl shadow-[0_0_30px_rgba(0,255,157,0.4)] animate-pulse hover:animate-none flex items-center justify-center gap-4 text-black font-black tracking-widest"
						onClick={handleUrgeKiller}
					>
						<span className="relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
						</span>
						ENGAGE
					</Button>
				</motion.div>
			</div>
		</motion.div>
	);
};
