import { motion } from "framer-motion";
import type { TimerProps } from "./types";

export const AnalogueTimer = ({ timeLeft, totalTime, className }: TimerProps) => {
    const rotation = (timeLeft / totalTime) * 360;

    return (
        <div className={`relative flex items-center gap-4 ${className}`}>
            <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Clock Face */}
                <div className="absolute inset-0 border-2 border-white/20 rounded-full" />

                {/* Hour Markers */}
                {[0, 90, 180, 270].map((deg) => (
                    <div
                        key={deg}
                        className="absolute w-0.5 h-1.5 bg-white/40"
                        style={{ transform: `rotate(${deg}deg) translateY(-20px)` }}
                    />
                ))}

                {/* Hand */}
                <motion.div
                    className="absolute w-[2px] h-5 bg-secondary origin-bottom rounded-full"
                    style={{ top: "10px" }}
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-secondary rounded-full shadow-[0_0_10px_var(--color-secondary)]" />
                </motion.div>

                <div className="w-1.5 h-1.5 bg-white rounded-full z-10" />
            </div>

            <div className="flex flex-col">
                <span className={`text-xl font-mono font-bold ${timeLeft < 10 ? "text-error" : "text-white"}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </span>
            </div>
        </div>
    );
};
