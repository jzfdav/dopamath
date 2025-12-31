import { motion } from "framer-motion";
import { ArrowLeft, Award, BarChart3, Target, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { getHistory } from "@/utils/storage";

export const Stats = () => {
	const navigate = useNavigate();
	const history = getHistory();

	const totalScore = history.reduce((sum, h) => sum + h.score, 0);
	const avgAccuracy =
		history.length > 0
			? Math.round(
					history.reduce((sum, h) => sum + h.accuracy, 0) / history.length,
				)
			: 0;
	const gamesPlayed = history.length;
	const bestScore = history.reduce((max, h) => Math.max(max, h.score), 0);

	const achievements = [
		{
			id: "fast_start",
			title: "Fast Start",
			desc: "Complete your first session",
			unlocked: gamesPlayed >= 1,
		},
		{
			id: "centurion",
			title: "Centurion",
			desc: "Score 100+ in a single game",
			unlocked: bestScore >= 100,
		},
		{
			id: "perfectionist",
			title: "Perfectionist",
			desc: "Reach 100% accuracy in a game",
			unlocked: history.some((h) => h.accuracy === 100),
		},
		{
			id: "veteran",
			title: "Veteran",
			desc: "Play 10+ games",
			unlocked: gamesPlayed >= 10,
		},
	];

	return (
		<motion.div
			className="flex flex-col w-full h-full relative p-6 overflow-hidden"
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 1.05 }}
		>
			<header className="flex items-center gap-4 mb-8 pt-safe">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate("/")}
					className="p-2 h-auto"
				>
					<ArrowLeft size={20} />
				</Button>
				<h1 className="text-xl font-bold uppercase tracking-widest text-text-dim">
					Dashboard
				</h1>
			</header>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 gap-4 mb-8">
				<StatCard
					icon={<Trophy size={20} className="text-primary" />}
					label="Total Score"
					value={totalScore.toLocaleString()}
				/>
				<StatCard
					icon={<Target size={20} className="text-secondary" />}
					label="Avg Accuracy"
					value={`${avgAccuracy}%`}
				/>
				<StatCard
					icon={<BarChart3 size={20} className="text-accent" />}
					label="Sessions"
					value={gamesPlayed.toString()}
				/>
				<StatCard
					icon={<Award size={20} className="text-yellow-400" />}
					label="Best Score"
					value={bestScore.toString()}
				/>
			</div>

			{/* Achievements */}
			<h2 className="text-[10px] uppercase tracking-[0.3em] text-text-dim mb-4 px-2">
				Achievements
			</h2>
			<div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
				{achievements.map((ach) => (
					<div
						key={ach.id}
						className={`glass-panel p-4 rounded-2xl flex items-center gap-4 transition-all ${ach.unlocked ? "opacity-100 border-primary/20" : "opacity-30 grayscale"}`}
					>
						<div
							className={`p-3 rounded-xl ${ach.unlocked ? "bg-primary/20 text-primary" : "bg-white/5 text-text-dim"}`}
						>
							<Award size={24} />
						</div>
						<div>
							<h3 className="font-bold text-sm text-white">{ach.title}</h3>
							<p className="text-[10px] text-text-dim">{ach.desc}</p>
						</div>
						{ach.unlocked && (
							<div className="ml-auto text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
								UNLOCKED
							</div>
						)}
					</div>
				))}
			</div>

			<footer className="mt-6 pb-safe flex flex-col items-center">
				<span className="text-[10px] text-text-dim/40 uppercase tracking-widest">
					Lifetime Stats
				</span>
			</footer>
		</motion.div>
	);
};

const StatCard = ({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) => (
	<div className="glass-panel p-4 rounded-2xl flex flex-col gap-2 border-white/5 shadow-inner">
		<div className="flex items-center gap-2">
			{icon}
			<span className="text-[10px] uppercase font-bold text-text-dim">
				{label}
			</span>
		</div>
		<span className="text-2xl font-black text-white">{value}</span>
	</div>
);
