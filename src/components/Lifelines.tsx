import { Clock, Lightbulb, Shield, SkipForward, Zap } from "lucide-react";
import { Button } from "@/components/Button";
import { useGame } from "@/context/GameContext";

interface LifelinesProps {
	onFiftyFifty: () => void;
	onSkip: () => void;
	onFreeze: () => void;
	onSimplify: () => void;
	onShield?: () => void;
}

export const Lifelines = ({
	onFiftyFifty,
	onSkip,
	onFreeze,
	onSimplify,
	onShield,
}: LifelinesProps) => {
	const { state } = useGame();

	return (
		<div className="flex w-full gap-1 mb-6 px-1">
			<LifelineButton
				icon={<Zap size={16} />}
				label="50/50"
				available={state.lifelines.fiftyFifty}
				onClick={onFiftyFifty}
			/>
			<LifelineButton
				icon={<Clock size={16} />}
				label="Freeze"
				available={state.lifelines.freezeTime}
				onClick={onFreeze}
			/>
			<LifelineButton
				icon={<Shield size={16} />}
				label="Shield"
				available={state.lifelines.secondChance}
				onClick={onShield || (() => {})}
			/>
			<LifelineButton
				icon={<Lightbulb size={16} />}
				label="Simpl"
				available={state.lifelines.simplify}
				onClick={onSimplify}
			/>
			<LifelineButton
				icon={<SkipForward size={16} />}
				label="Skip"
				available={state.lifelines.skip}
				onClick={onSkip}
			/>
		</div>
	);
};

const LifelineButton = ({
	icon,
	label,
	available,
	onClick,
}: {
	icon: React.ReactNode;
	label: string;
	available: boolean;
	onClick: () => void;
}) => (
	<Button
		variant="ghost"
		size="sm"
		disabled={!available}
		onClick={onClick}
		className={`flex-1 flex flex-col items-center gap-1 min-w-0 px-1 py-3 border border-white/5 rounded-xl ${!available ? "opacity-20 grayscale" : "hover:bg-white/10 active:scale-90"}`}
	>
		<div className={`${available ? "text-primary" : "text-text-dim"}`}>
			{icon}
		</div>
		<span className="text-[9px] uppercase font-black tracking-tighter truncate w-full text-center">
			{label}
		</span>
	</Button>
);
