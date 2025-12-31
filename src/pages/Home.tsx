import { motion, type Variants } from "framer-motion";
import { BarChart3, HelpCircle, Settings as SettingsIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TimeSelector } from "@/components/TimeSelector";
import { InfoModal } from "@/components/InfoModal";
import { useSettings } from "@/context/SettingsContext";

const SESSION_INTERVALS = [1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

export const Home = () => {
	const navigate = useNavigate();
	const { settings, updateSettings } = useSettings();

	const [selectedTime, setSelectedTime] = useState(settings.lastMinutes);
	const [contentMode, setContentMode] = useState(settings.lastContentMode);
	const [isInfoOpen, setIsInfoOpen] = useState(false);

	// Persist changes to settings
	useEffect(() => {
		updateSettings({ lastMinutes: selectedTime, lastContentMode: contentMode });
	}, [selectedTime, contentMode, updateSettings]);

	const handleStart = () => {
		navigate(`/game?mode=prime&minutes=${selectedTime}&content=${contentMode}`);
	};

	// Animation variants
	const containerVariants: Variants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 24
			}
		},
	};

	return (
		<div className="flex flex-col min-h-[100dvh] relative overflow-hidden bg-background">
			{/* Decorative background elements */}
			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

			<motion.div
				className="flex-1 flex flex-col items-center justify-center p-6 h-full min-h-0 overflow-y-auto scrollbar-hide"
				variants={containerVariants}
				initial="hidden"
				animate="show"
			>
				{/* Logo Section */}
				<motion.div variants={itemVariants} className="text-center mb-6 sm:mb-12">
					<motion.div
						animate={{
							y: [0, -10, 0],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="inline-block"
					>
						<h1 className="text-6xl sm:text-7xl font-black italic tracking-tighter text-white drop-shadow-neon select-none leading-none">
							DOPA<br /><span className="text-primary">MATH</span>
						</h1>
					</motion.div>
					<p className="text-text-dim mt-2 sm:mt-4 font-medium tracking-widest uppercase text-[10px] opacity-60">
						Active Consumption • Earned Dopamine
					</p>
				</motion.div>

				{/* Time Selection */}
				<motion.div variants={itemVariants} className="w-full max-w-xs mb-6 sm:mb-8">
					<div className="flex justify-center mb-2">
						<span className="text-[10px] text-primary/50 uppercase tracking-[0.2em] font-bold">
							Session Duration
						</span>
					</div>
					<TimeSelector
						options={SESSION_INTERVALS}
						selected={selectedTime}
						onSelect={setSelectedTime}
					/>
				</motion.div>

				{/* Mode Selection */}
				<motion.div variants={itemVariants} className="w-full max-w-xs mb-8 sm:mb-12">
					<div className="glass-panel p-1 rounded-2xl flex gap-1 h-14">
						<button
							type="button"
							onClick={() => setContentMode("arithmetic")}
							className={`flex-1 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${contentMode === "arithmetic"
								? "bg-white text-black shadow-lg"
								: "text-text-dim hover:text-white"
								}`}
						>
							Arithmetic
						</button>
						<button
							type="button"
							onClick={() => setContentMode("mixed")}
							className={`flex-1 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${contentMode === "mixed"
								? "bg-white text-black shadow-lg"
								: "text-text-dim hover:text-white"
								}`}
						>
							Mixed
						</button>
					</div>
				</motion.div>

				{/* Main Action Section (Thumb Zone) */}
				<motion.div variants={itemVariants} className="w-full max-w-sm flex flex-col items-center gap-4 sm:gap-6">
					{/* Navigation Icons Row Above Engage button */}
					<div className="flex items-center gap-6 mb-1 sm:mb-2">
						<motion.button
							whileHover={{ scale: 1.1, rotate: -5 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => navigate("/stats")}
							className="p-3 sm:p-4 glass-panel rounded-2xl text-text-dim hover:text-primary transition-colors hover:border-primary/30"
						>
							<BarChart3 size={24} />
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => setIsInfoOpen(true)}
							className="p-3 sm:p-4 glass-panel rounded-2xl text-text-dim hover:text-primary transition-colors hover:border-primary/30"
						>
							<HelpCircle size={24} />
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.1, rotate: 5 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => navigate("/settings")}
							className="p-3 sm:p-4 glass-panel rounded-2xl text-text-dim hover:text-primary transition-colors hover:border-primary/30"
						>
							<SettingsIcon size={24} />
						</motion.button>
					</div>

					{/* Primary Engage CTA */}
					<motion.button
						whileHover={{
							scale: 1.05,
							boxShadow: "0 0 40px rgba(0, 255, 157, 0.4)"
						}}
						whileTap={{ scale: 0.95 }}
						onClick={handleStart}
						className="relative group bg-primary text-black font-black text-2xl sm:text-3xl italic tracking-tighter px-12 sm:px-16 py-6 sm:py-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_20px_40px_rgba(0,255,157,0.25)] transition-all overflow-hidden"
					>
						<div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
						ENGAGE
					</motion.button>

					<p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim opacity-40">
						Ready for recalibration?
					</p>
				</motion.div>
			</motion.div>

			<InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
		</div>
	);
};
