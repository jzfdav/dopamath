import { type HTMLMotionProps, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { triggerHaptic } from "@/utils/audio";

interface ButtonProps extends HTMLMotionProps<"button"> {
	variant?:
	| "primary"
	| "secondary"
	| "danger"
	| "ghost"
	| "outline"
	| "neon"
	| "glass";
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
	hapticIntensity?: "light" | "medium" | "heavy" | null;
}

export const Button = ({
	variant = "primary",
	size = "md",
	className,
	children,
	onClick,
	hapticIntensity = "light",
	...props
}: ButtonProps) => {
	const baseStyles =
		"relative overflow-hidden font-bold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-center flex items-center justify-center";

	const variants = {
		primary:
			"bg-primary text-black shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.6)] hover:scale-105",
		secondary:
			"bg-secondary text-white shadow-[0_0_20px_rgba(189,0,255,0.3)] hover:shadow-[0_0_30px_rgba(189,0,255,0.6)] hover:scale-105",
		danger:
			"bg-gradient-to-b from-[#FF0055] to-[#D00045] text-white shadow-[0_0_20px_rgba(255,0,85,0.3)] hover:shadow-[0_0_30px_rgba(255,0,85,0.6)] hover:scale-105 border-t border-white/20",
		ghost: "bg-transparent text-text hover:bg-white/10",
		outline:
			"border-2 border-primary/50 text-primary hover:border-primary hover:bg-primary/10",
		neon: "bg-transparent border border-primary text-primary shadow-[0_0_10px_var(--color-primary),inset_0_0_10px_var(--color-primary)] hover:bg-primary hover:text-black hover:shadow-[0_0_20px_var(--color-primary),inset_0_0_20px_var(--color-primary)]",
		glass:
			"bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-lg hover:shadow-xl",
	};

	const sizes = {
		sm: "px-3 py-1 text-sm",
		md: "px-6 py-3 text-base",
		lg: "px-8 py-4 text-lg",
		xl: "px-10 py-6 text-2xl",
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (hapticIntensity) {
			triggerHaptic(hapticIntensity);
		}
		onClick?.(e);
	};

	return (
		<motion.button
			whileTap={{ scale: 0.92 }}
			whileHover={{ scale: 1.02 }}
			className={twMerge(baseStyles, variants[variant], sizes[size], className)}
			onClick={handleClick}
			{...props}
		>
			{children}
		</motion.button>
	);
};
