import { motion } from "framer-motion";
import type { TimerProps } from "./types";

export const DigitalTimer = ({ timeLeft, isFrozen, className }: TimerProps) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <motion.div
            animate={{
                scale: timeLeft < 10 ? [1, 1.1, 1] : 1,
                textShadow: timeLeft < 10 ? "0 0 20px rgba(255, 0, 85, 0.8)" : "none",
            }}
            transition={{
                repeat: timeLeft < 10 ? Infinity : 0,
                duration: timeLeft < 10 ? 0.5 : 1,
            }}
            className={`text-3xl font-mono font-bold tracking-tight ${timeLeft < 10 ? "text-error" : isFrozen ? "text-primary" : "text-white"} ${className}`}
        >
            {minutes}:{seconds.toString().padStart(2, "0")}
        </motion.div>
    );
};
