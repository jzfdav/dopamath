import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
	id: string;
	x: number;
	y: number;
	color: string;
	size: number;
}

export const ParticleBurst = ({
	active,
	onComplete,
}: {
	active: boolean;
	onComplete: () => void;
}) => {
	const [particles, setParticles] = useState<Particle[]>([]);

	useEffect(() => {
		if (active) {
			const newParticles: Particle[] = Array.from({ length: 20 }).map(
				(_, i) => ({
					id: Math.random().toString(),
					x: (Math.random() - 0.5) * 200,
					y: (Math.random() - 0.5) * 200,
					color:
						i % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary)",
					size: Math.random() * 6 + 2,
				}),
			);
			setParticles(newParticles);
			const timer = setTimeout(() => {
				setParticles([]);
				onComplete();
			}, 800);
			return () => clearTimeout(timer);
		}
	}, [active, onComplete]);

	if (particles.length === 0) return null;

	return (
		<div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-50">
			{particles.map((p) => (
				<motion.div
					key={p.id}
					initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
					animate={{
						x: p.x,
						y: p.y,
						opacity: 0,
						scale: 0,
						rotate: Math.random() * 360,
					}}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="absolute rounded-full"
					style={{
						backgroundColor: p.color,
						width: p.size,
						height: p.size,
						boxShadow: `0 0 10px ${p.color}`,
					}}
				/>
			))}
		</div>
	);
};
