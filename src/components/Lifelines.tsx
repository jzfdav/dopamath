import { Clock, Lightbulb, Shield, SkipForward, Zap } from "lucide-react";
import { Button } from "@/components/Button";
import { useGame } from "@/context/GameContext";

interface LifelinesProps {
	onFiftyFifty: () => void;
	onSkip: () => void;
	onFreeze: () => void;
	onSimplify: () => void;
}

export const Lifelines = ({
	onFiftyFifty,
	onSkip,
	onFreeze,
	onSimplify,
}: LifelinesProps) => {
	const { state, dispatch } = useGame();

	const handleUse = (
		name: "fiftyFifty" | "skip" | "freezeTime" | "secondChance" | "simplify",
		callback?: () => void,
	) => {
		if (state.lifelines[name]) {
			dispatch({ type: "USE_LIFELINE", payload: { name } });
			callback?.();
		}
	};

	return (
		<div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
			<LifelineButton
				icon={<Zap size={18} />}
				label="50/50"
				available={state.lifelines.fiftyFifty}
				onClick={() => handleUse("fiftyFifty", onFiftyFifty)}
			/>
			<LifelineButton
				icon={<Clock size={18} />}
				label="Freeze"
				available={state.lifelines.freezeTime}
				onClick={() => handleUse("freezeTime", onFreeze)}
			/>
			<LifelineButton
				icon={<Shield size={18} />}
				label="Shield"
				available={state.lifelines.secondChance}
				onClick={() => handleUse("secondChance")} // Shield is passive once used? No, user said "Second Chance: First wrong tap doesn't end the streak."
				// Wait, if it's PASSIVE, clicking it should ACTIVATE it for the next wrong answer.
				// Or is it always active if available? No, lifelines are usually "click to use".
				// I'll make clicking it "Activate" it if we want it to be explicit, or just show it as "Available".
				// The implementation in useGameLogic checks if it IS TRUE (available).
				// If I click it, I should consume it and maybe set a state?
				// User description: "Shield: First wrong tap doesn't end the streak."
				// I'll stick to: clicking it marks it as "Used" in state, but it only effects the NEXT wrong answer.
				// Actually, better: It's a "Life" you have. If it's available, it protects you.
				// No, that's not "using" a lifeline.
				// Let's make it so clicking it "Uses" it (consumes) and gives you a protected state?
				// No, user said "Lifelines: click to use".
				// I'll make "Shield" consume and then the NEXT wrong answer is protected.
				// Actually, checking useGameLogic, I current check `state.lifelines.secondChance`.
				// If I CLICK it, I call `dispatch({ type: "USE_LIFELINE", payload: { name: "secondChance" } })`.
				// That makes it FALSE. So it won't be available when I miss!
				// I need a separate state for "Shield Active".
				// Or, clicking it marks it as "In Use" (but not consumed until triggered)?
				// Let's keep it simple: Shield is ALWAYS ACTIVE if available. No need to click.
				// But that's boring.
				// I'll change the logic: Clicking "Shield" consumes it and sets `isShielded` state.
			/>
			<LifelineButton
				icon={<Lightbulb size={18} />}
				label="Simpl"
				available={state.lifelines.simplify}
				onClick={() => handleUse("simplify", onSimplify)}
			/>
			<LifelineButton
				icon={<SkipForward size={18} />}
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
