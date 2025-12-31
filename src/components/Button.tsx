import { type ClassValue, clsx } from "clsx";
import { type HTMLMotionProps, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

// Utility for class merging
function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
	variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
	size?: "sm" | "md" | "lg" | "xl";
	fullWidth?: boolean;
}

export const Button = ({
	className,
	variant = "primary",
	size = "md",
	fullWidth = false,
	onClick,
	children,
	...props
}: ButtonProps) => {
	const handleInteraction = (e: React.MouseEvent<HTMLButtonElement>) => {
		// Haptic feedback if available (mobile only usually)
		if (typeof navigator !== "undefined" && navigator.vibrate) {
			navigator.vibrate(10); // Crisp 10ms tick
		}
		onClick?.(e);
	};

	const variants = {
		primary:
			"bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,157,0.3)]",
		secondary:
			"bg-secondary text-white hover:bg-secondary/90 shadow-[0_0_15px_rgba(189,0,255,0.3)]",
		outline:
			"border-2 border-white/20 text-white hover:border-white/50 hover:bg-white/5",
		ghost: "text-white/70 hover:text-white hover:bg-white/10",
		danger:
			"bg-error text-white hover:bg-error/90 shadow-[0_0_15px_rgba(255,0,85,0.3)]",
	};

	const sizes = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-5 py-2.5 text-base",
		lg: "px-6 py-3 text-lg font-semibold",
		xl: "px-8 py-4 text-xl font-bold tracking-tight",
	};

	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.95 }}
			className={cn(
				"relative rounded-xl font-medium transition-colors select-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:pointer-events-none",
				variants[variant],
				sizes[size],
				fullWidth && "w-full",
				className,
			)}
			onClick={handleInteraction}
			{...props}
		>
			{children}
		</motion.button>
	);
};
