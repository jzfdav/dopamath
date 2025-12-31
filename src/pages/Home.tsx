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
		<div className="flex flex-col items-center w-full h-full relative">
			{/* Hero Section: Urge Killer */}
			<div className="flex-1 flex flex-col items-center justify-center w-full min-h-[40vh]">
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5, type: "spring" }}
				>
					<Button
						variant="danger"
						size="xl"
						className="rounded-full w-48 h-48 flex items-center justify-center text-3xl shadow-[0_0_50px_rgba(255,0,85,0.4)] animate-pulse hover:animate-none"
						onClick={handleUrgeKiller}
					>
						URGE
						<br />
						KILLER
					</Button>
				</motion.div>
				<p className="mt-8 text-white/50 text-sm uppercase tracking-widest">
					Immediate Intervention
				</p>
			</div>

			{/* Prime Flow Selection */}
			<div className="w-full pb-12 px-4">
				<div className="flex items-center justify-between mb-6 px-2">
					<h2 className="text-xl font-bold text-primary">Prime Flow</h2>
					<span className="text-xs text-white/40 uppercase tracking-wider">
						Select Duration
					</span>
				</div>

				<div className="grid grid-cols-5 gap-3">
					{PRIME_INTERVALS.map((min, i) => (
						<motion.div
							key={min}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.05 }}
						>
							<Button
								variant="ghost"
								className="w-full aspect-square flex flex-col items-center justify-center border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all group"
								onClick={() => handlePrimeSelect(min)}
							>
								<span className="text-xl font-mono text-white group-hover:text-primary transition-colors">
									{min}
								</span>
								<span className="text-[10px] text-white/30 lowercase">min</span>
							</Button>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};
