import { Clock, SkipForward, Zap } from "lucide-react";
import { Button } from "@/components/Button";
import { useGame } from "@/context/GameContext";

interface LifelinesProps {
	onFiftyFifty: () => void;
	onSkip: () => void;
	onFreeze: () => void;
}

export const Lifelines = ({
	onFiftyFifty,
	onSkip,
	onFreeze,
}: LifelinesProps) => {
	const { state, dispatch } = useGame();

	const handleUse = (
		name: "fiftyFifty" | "skip" | "freezeTime",
		callback: () => void,
	) => {
		if (state.lifelines[name]) {
			dispatch({ type: "USE_LIFELINE", payload: { name } });
			callback();
		}
	};

	return (
		<div className="flex gap-4 mb-6">
			<LifelineButton
				icon={<Zap size={20} />}
				label="50/50"
				available={state.lifelines.fiftyFifty}
				onClick={() => handleUse("fiftyFifty", onFiftyFifty)}
			/>
			<LifelineButton
				icon={<Clock size={20} />}
				label="Freeze"
				available={state.lifelines.freezeTime}
				onClick={() => handleUse("freezeTime", onFreeze)}
			/>
			<LifelineButton
				icon={<SkipForward size={20} />}
				label="Skip"
				available={state.lifelines.skip}
				onClick={() => handleUse("skip", onSkip)}
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
		className={`flex flex-col items-center gap-1 min-w-[4rem] border border-white/10 ${!available ? "opacity-30" : "hover:bg-white/10"}`}
	>
		{icon}
		<span className="text-[10px] uppercase font-bold">{label}</span>
	</Button>
);
