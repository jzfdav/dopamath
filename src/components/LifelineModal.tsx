import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";

export interface LifelineInfo {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
}

interface LifelineModalProps {
    isOpen: boolean;
    lifeline: LifelineInfo | null;
    onClose: (dontShowAgain: boolean) => void;
    onConfirm: (dontShowAgain: boolean) => void;
}

export const LifelineModal = ({
    isOpen,
    lifeline,
    onClose,
    onConfirm,
}: LifelineModalProps) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    if (!lifeline) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => onClose(dontShowAgain)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm glass-panel p-8 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Animated Background Pulse */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                                {lifeline.icon}
                            </div>

                            <h2 className="text-3xl font-black italic tracking-tighter text-white mb-4 uppercase">
                                {lifeline.name}
                            </h2>

                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mb-8">
                                <p className="text-text-dim text-sm font-medium leading-relaxed italic">
                                    "{lifeline.description}"
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setDontShowAgain(!dontShowAgain)}
                                className="flex items-center gap-3 mb-8 group cursor-pointer"
                            >
                                <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${dontShowAgain ? "bg-primary border-primary" : "border-white/20 group-hover:border-white/40"}`}>
                                    {dontShowAgain && <Check size={14} className="text-black font-bold" />}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-dim group-hover:text-white transition-colors">
                                    Don't show this again
                                </span>
                            </button>

                            <div className="w-full flex flex-col gap-3">
                                <Button
                                    variant="primary"
                                    size="xl"
                                    onClick={() => onConfirm(dontShowAgain)}
                                    className="w-full h-16 rounded-2xl text-lg font-black tracking-widest shadow-lg shadow-primary/20"
                                >
                                    ENGAGE LIFELINE
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => onClose(dontShowAgain)}
                                    className="py-3 text-[10px] font-black uppercase tracking-widest text-text-dim hover:text-white transition-colors"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
