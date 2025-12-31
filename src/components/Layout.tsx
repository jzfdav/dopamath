import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface LayoutProps {
	children: ReactNode;
}

import noiseBg from "@/assets/noise.svg";

export const Layout = ({ children }: LayoutProps) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex flex-col flex-1 w-full h-full max-w-md mx-auto p-4 relative"
		>
			{/* Persistent Global Background Noise */}
			<div
				className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay z-0"
				style={{ backgroundImage: `url(${noiseBg})` }}
			></div>

			{/* Content w/ Z-Index to sit above bg */}
			<div className="relative z-10 w-full h-full flex flex-col">
				{children}
			</div>
		</motion.div>
	);
};
