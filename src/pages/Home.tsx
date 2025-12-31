import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";

const PRIME_INTERVALS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

export const Home = () => {
	const navigate = useNavigate();

	const handleUrgeKiller = () => {
		navigate("/game?mode=blitz");
	};

	const handlePrimeSelect = (minutes: number) => {
		navigate(`/game?mode=prime&minutes=${minutes}`);
	};

	return (
		<div className="flex flex-col w-full h-full relative px-6 overflow-hidden">
			{/* Background Texture */}
			<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

			{/* Hero Section (Takes remaining space) */}
			<div className="flex-1 flex flex-col items-center justify-center w-full z-10">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5, type: "spring" }}
					className="flex flex-col items-center"
				>
					<h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary neon-text tracking-tighter mb-2">
						DOPA
						<br />
						MATH
					</h1>
					<p className="text-text-dim text-sm uppercase tracking-[0.3em] opacity-70">
						Dopamine Re-Engineered
					</p>
				</motion.div>
			</div>

			{/* Thumb Zone Section (Anchored to bottom) */}
			<div className="flex-none flex flex-col justify-end gap-6 w-full z-20 pb-8 pt-4">
				{/* Mode Toggles / Secondary Actions can go here if needed */}

				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-center px-2">
						<span className="text-[10px] text-text-dim uppercase tracking-[0.2em] font-bold opacity-60">
							Select Impulse
						</span>
					</div>

					<div className="grid grid-cols-5 gap-3">
						{PRIME_INTERVALS.map((min, i) => (
							<motion.div
								key={min}
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									delay: i * 0.05,
									type: "spring",
									stiffness: 300,
									damping: 20,
								}}
							>
								<Button
									variant="glass"
									className="w-full aspect-square flex flex-col items-center justify-center p-0 !rounded-xl group"
									onClick={() => handlePrimeSelect(min)}
								>
									<span className="text-xl font-mono text-white group-hover:text-primary transition-colors">
										{min}
									</span>
								</Button>
							</motion.div>
						))}
					</div>
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
		</div>
	);
};
