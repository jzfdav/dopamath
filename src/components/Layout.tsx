import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface LayoutProps {
	children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex flex-col flex-1 w-full h-full max-w-md mx-auto p-4"
		>
			{children}
		</motion.div>
	);
};
