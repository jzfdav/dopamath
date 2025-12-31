import { motion } from "framer-motion";
import { ArrowLeft, Smartphone, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { VisualTimer } from "@/components/VisualTimer";
import { type TimerStyle, useSettings } from "@/context/SettingsContext";

const TIMER_STYLES: { id: TimerStyle; label: string }[] = [
	{ id: "digital", label: "Digital" },
	{ id: "hourglass", label: "Hourglass" },
	{ id: "analogue", label: "Sweep" },
	{ id: "ring", label: "Neon Ring" },
	{ id: "glitch", label: "Glitch" },
	{ id: "fuse", label: "Fuse" },
	{ id: "melting", label: "Melting" },
];

export const Settings = () => {
	const navigate = useNavigate();
	const { settings, updateSettings } = useSettings();

	return (
		<motion.div
			className="flex flex-col w-full h-full relative p-6 overflow-hidden"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
		>
			<header className="flex items-center gap-4 mb-8 pt-safe">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate(-1)}
					className="p-2 h-auto"
				>
					<ArrowLeft size={20} />
				</Button>
				<h1 className="text-xl font-bold uppercase tracking-widest text-text-dim">
					Settings
				</h1>
			</header>

			<div className="flex-1 overflow-y-auto pr-2 space-y-8 scrollbar-hide">
				{/* Audio/Haptics Section */}
				<section className="space-y-4">
					<h2 className="text-[10px] uppercase tracking-[0.3em] text-text-dim/60 font-bold px-2">
						System Feedback
					</h2>
					<div className="flex flex-col gap-3">
						<SettingToggle
							icon={<Volume2 size={20} />}
							label="Audio Ticks"
							description="Satisfying sounds for every answer"
							active={settings.audioTicksEnabled}
							onToggle={() =>
								updateSettings({
									audioTicksEnabled: !settings.audioTicksEnabled,
								})
							}
						/>

						<SettingToggle
							icon={<Smartphone size={20} />}
							label="Haptic Feedback"
							description="Subtle vibrations on interaction"
							active={settings.hapticsEnabled}
							onToggle={() =>
								updateSettings({ hapticsEnabled: !settings.hapticsEnabled })
							}
						/>
					</div>
				</section>

				{/* Timer Visuals Section */}
				<section className="space-y-4">
					<h2 className="text-[10px] uppercase tracking-[0.3em] text-text-dim/60 font-bold px-2">
						Timer Visuals
					</h2>

					{/* Preview Block */}
					<div className="glass-panel w-full p-8 rounded-3xl flex flex-col items-center justify-center border-primary/20 bg-primary/5 min-h-[160px]">
						<VisualTimer timeLeft={42} totalTime={60} className="scale-125" />
						<span className="mt-6 text-[10px] uppercase font-black tracking-widest text-primary animate-pulse">
							Live Preview
						</span>
					</div>

					{/* Style Selector */}
					<div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
						{TIMER_STYLES.map((style) => (
							<button
								type="button"
								key={style.id}
								onClick={() => updateSettings({ timerStyle: style.id })}
								className={`flex-none px-6 py-4 rounded-2xl glass-panel border transition-all active:scale-95 ${
									settings.timerStyle === style.id
										? "border-primary bg-primary/10 text-primary"
										: "border-white/5 text-text-dim hover:border-white/20"
								}`}
							>
								<span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">
									{style.label}
								</span>
							</button>
						))}
					</div>
				</section>
			</div>

			<footer className="mt-auto pb-safe flex flex-col items-center">
				<span className="text-[10px] text-text-dim/40 uppercase tracking-widest text-center">
					DopaMath v1.1.0
					<br />
					Build {__BUILD_DATE__.replace(/[-T:]/g, "").slice(0, 13)}
				</span>
			</footer>
		</motion.div>
	);
};

const SettingToggle = ({
	icon,
	label,
	description,
	active,
	onToggle,
}: {
	icon: React.ReactNode;
	label: string;
	description: string;
	active: boolean;
	onToggle: () => void;
}) => (
	<button
		type="button"
		onClick={onToggle}
		className="glass-panel w-full p-6 rounded-2xl flex items-center gap-6 text-left transition-all active:scale-[0.98]"
	>
		<div
			className={`p-3 rounded-xl ${active ? "bg-primary text-black" : "bg-white/5 text-text-dim"}`}
		>
			{icon}
		</div>
		<div className="flex-1">
			<h3 className="font-bold text-white mb-0.5">{label}</h3>
			<p className="text-xs text-text-dim">{description}</p>
		</div>
		<div
			className={`w-12 h-6 rounded-full relative transition-colors ${active ? "bg-primary/30" : "bg-white/10"}`}
		>
			<motion.div
				className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white"
				animate={{ x: active ? 24 : 0 }}
				transition={{ type: "spring", stiffness: 500, damping: 30 }}
			/>
		</div>
	</button>
);
