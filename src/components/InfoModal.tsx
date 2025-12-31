import { AnimatePresence, motion } from "framer-motion";
import { Brain, HelpCircle, Target, X, Zap } from "lucide-react";
import { Button } from "./Button";

interface InfoModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const InfoModal = ({ isOpen, onClose }: InfoModalProps) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-black/80 backdrop-blur-sm"
					/>

					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						className="relative w-full max-w-md max-h-[80vh] bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
					>
						<header className="flex items-center justify-between p-6 border-b border-white/5">
							<div className="flex items-center gap-3 text-primary">
								<HelpCircle size={24} />
								<h2 className="text-xl font-black uppercase tracking-widest">
									Guidance
								</h2>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={onClose}
								className="p-2 h-auto"
							>
								<X size={20} />
							</Button>
						</header>

						<div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
							{/* Philosophy Section */}
							<section className="space-y-3">
								<div className="flex items-center gap-2 text-secondary">
									<Brain size={18} />
									<h3 className="text-xs uppercase font-black tracking-widest">
										The Philosophy
									</h3>
								</div>
								<p className="text-sm text-text-dim leading-relaxed">
									<span className="text-white font-bold">
										Math is the new scroll.
									</span>{" "}
									Most apps are designed to harvest your attention via passive
									scrolling. This triggers "cheap" dopamine, leaving you drained
									and distracted.
								</p>
								<p className="text-sm text-text-dim leading-relaxed">
									DopaMath re-engineers this loop. By engaging in high-intensity
									mental calculation, you trigger{" "}
									<span className="text-primary font-bold">
										earned dopamine
									</span>
									—the kind that builds focus instead of destroying it.
								</p>
							</section>

							{/* Game Modes Section */}
							<section className="space-y-4">
								<div className="flex items-center gap-2 text-primary">
									<Target size={18} />
									<h3 className="text-xs uppercase font-black tracking-widest">
										Game Modes
									</h3>
								</div>

								<div className="space-y-4">
									<div className="bg-white/5 p-4 rounded-2xl border border-white/5">
										<h4 className="text-sm font-bold text-white mb-1 uppercase tracking-tighter">
											Arithmetic
										</h4>
										<p className="text-[11px] text-text-dim">
											Addition & Subtraction only. Designed for pure velocity
											and warming up your cognitive flow.
										</p>
									</div>

									<div className="bg-white/5 p-4 rounded-2xl border border-white/5">
										<h4 className="text-sm font-bold text-secondary mb-1 uppercase tracking-tighter">
											Mega-Mixed
										</h4>
										<p className="text-[11px] text-text-dim">
											The full spectrum: Addition, Subtraction, Multiplication,
											and Division. Maximum engagement for total focus.
										</p>
									</div>
								</div>
							</section>

							{/* Tip Section */}
							<section className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
								<div className="flex items-center gap-2 text-primary mb-1">
									<Zap size={14} />
									<h4 className="text-[10px] uppercase font-black tracking-widest">
										Pro Tip
									</h4>
								</div>
								<p className="text-[11px] text-text-dim leading-tight">
									Use the <span className="text-white font-bold">Shield</span>{" "}
									lifeline early if you're feeling frantic. It maintains your
									streak even if you mis-tap under pressure.
								</p>
							</section>
						</div>

						<footer className="p-6 bg-white/5 border-t border-white/5 flex justify-center">
							<Button
								variant="primary"
								size="md"
								onClick={onClose}
								className="w-full"
							>
								GOT IT
							</Button>
						</footer>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};
