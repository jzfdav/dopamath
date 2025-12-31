import { motion } from "framer-motion";
import type { TimerProps } from "./types";

export const HourglassTimer = ({ timeLeft, totalTime, isFrozen, className }: TimerProps) => {
    const progress = timeLeft / totalTime;

    return (
        <div className={`relative flex items-center gap-4 ${className}`}>
            <svg width="40" height="60" viewBox="0 0 40 60" className="drop-shadow-neon">
                {/* Top Half */}
                <path
                    d="M5 5 L35 5 L35 25 L20 30 L5 25 Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.3"
                />
                <motion.path
                    d="M5 25 L35 25 L35 25 L20 25 L5 25 Z"
                    fill="var(--color-secondary)"
                    initial={false}
                    animate={{
                        d: `M${5 + (1 - progress) * 15} ${25 - progress * 20} L${35 - (1 - progress) * 15} ${25 - progress * 20} L35 25 L20 30 L5 25 Z`
                    }}
                />

                {/* Bottom Half */}
                <path
                    d="M5 55 L35 55 L35 35 L20 30 L5 35 Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.3"
                />
                <motion.path
                    d="M20 30 L20 30 L20 30 L20 30 Z"
                    fill="var(--color-secondary)"
                    initial={false}
                    animate={{
                        d: `M20 30 L${5 + progress * 15} ${55 - (1 - progress) * 20} L${35 - progress * 15} ${55 - (1 - progress) * 20} L20 55 Z`
                    }}
                />

                {/* Falling Stream */}
                {timeLeft > 0 && !isFrozen && (
                    <motion.line
                        x1="20" y1="28" x2="20" y2="35"
                        stroke="var(--color-secondary)"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        animate={{ strokeDashoffset: [0, 10] }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                    />
                )}
            </svg>

            <div className="flex flex-col">
                <span className={`text-xl font-mono font-bold ${timeLeft < 10 ? "text-error" : "text-white"}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </span>
            </div>
        </div>
    );
};
