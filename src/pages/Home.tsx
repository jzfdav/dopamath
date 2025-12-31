import { motion } from "framer-motion";
import { BarChart3, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { TimeSelector } from "@/components/TimeSelector";

const SESSION_INTERVALS = [1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

export const Home = () => {
	const navigate = useNavigate();
	const [selectedTime, setSelectedTime] = useState(1);
	const [contentMode, setContentMode] = useState<"arithmetic" | "mixed">(
		"mixed",
	);

	const handleUrgeKiller = () => {
		navigate(`/game?mode=prime&minutes=${selectedTime}&content=${contentMode}`);
	};

	const handlePrimeSelect = (minutes: number) => {
		setSelectedTime(minutes);
	};

	return (
		<motion.div
			className="flex flex-col w-full h-full relative px-6 overflow-hidden"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			transition={{ duration: 0.3 }}
		>

			{/* Hero Section */}
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

			{/* Controls Section */}
			<div className="flex-none flex flex-col justify-end gap-6 w-full z-20 pb-8 pt-2">
				{/* Time Selection */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center justify-center">
						<span className="text-[10px] text-primary/50 uppercase tracking-[0.2em] font-bold">
							Session Duration
						</span>
					</div>
					<TimeSelector
						options={SESSION_INTERVALS}
						selected={selectedTime}
						onSelect={handlePrimeSelect}
					/>
				</div>

				{/* Content Mode Selection */}
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-center">
						<span className="text-[10px] text-secondary/50 uppercase tracking-[0.2em] font-bold">
							Operation Mode
						</span>
					</div>

					<div className="flex p-1 bg-white/5 rounded-2xl glass-panel relative overflow-hidden h-14">
						<motion.div
							className="absolute top-1 bottom-1 bg-white/10 rounded-xl"
							initial={false}
							animate={{
								x: contentMode === "arithmetic" ? 0 : "100%",
							}}
							style={{ width: "calc(50% - 4px)", left: 4 }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
						/>
						<button
							type="button"
							className={`flex-1 z-10 font-bold text-xs uppercase tracking-widest transition-colors ${contentMode === "arithmetic" ? "text-primary" : "text-text-dim"}`}
							onClick={() => setContentMode("arithmetic")}
						>
							Arithmetic
						</button>
						<button
							type="button"
							className={`flex-1 z-10 font-bold text-xs uppercase tracking-widest transition-colors ${contentMode === "mixed" ? "text-secondary" : "text-text-dim"}`}
							onClick={() => setContentMode("mixed")}
						>
							Mega-Mixed
						</button>
					</div>
				</div>

				{/* Primary CTA with Secondary Actions */}
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{
						delay: 0.3,
						type: "spring",
						stiffness: 200,
						damping: 20,
					}}
					className="flex items-center gap-4"
				>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate("/stats")}
						className="p-4 h-20 w-16 glass-panel rounded-2xl flex flex-col items-center justify-center text-text-dim/60 hover:text-secondary hover:border-secondary/30 transition-all active:scale-90"
					>
						<BarChart3 size={24} />
						<span className="text-[8px] mt-1 font-bold uppercase tracking-tighter">Stats</span>
					</Button>

					<Button
						variant="primary"
						size="xl"
						className="flex-1 h-20 text-2xl shadow-[0_0_30px_rgba(0,255,157,0.4)] animate-pulse hover:animate-none flex items-center justify-center gap-4 text-black font-black tracking-widest"
						onClick={handleUrgeKiller}
					>
						<span className="relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
						</span>
						ENGAGE
					</Button>

					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate("/settings")}
						className="p-4 h-20 w-16 glass-panel rounded-2xl flex flex-col items-center justify-center text-text-dim/60 hover:text-primary hover:border-primary/30 transition-all active:scale-90"
					>
						<SettingsIcon size={24} />
						<span className="text-[8px] mt-1 font-bold uppercase tracking-tighter">Set</span>
					</Button>
				</motion.div>
			</div>
		</motion.div>
	);
};
