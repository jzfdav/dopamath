import { motion } from "framer-motion";
import type { TimerProps } from "./types";

export const MeltingTimer = ({ timeLeft, className }: TimerProps) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const text = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return (
        <div className={`relative flex items-center justify-center h-16 ${className}`}>
            <div className="flex">
                {text.split("").map((char, i) => (
                    <motion.div
                        key={`${i}-${char}`}
                        className={`text-4xl font-mono font-black ${timeLeft < 10 ? "text-error" : "text-white"}`}
                        style={{
                            display: "inline-block",
                            position: "relative"
                        }}
                        animate={{
                            y: char === ":" ? 0 : [0, 2, 0, 3, 0],
                            scaleY: char === ":" ? 1 : [1, 1.1, 1, 1.2, 1],
                            opacity: char === ":" ? 1 : [1, 0.8, 1],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1 + Math.random(),
                            ease: "easeInOut"
                        }}
                    >
                        {char}
                        {/* Drip Effect */}
                        {char !== ":" && timeLeft < 20 && (
                            <motion.div
                                className={`absolute top-full left-1/2 -translate-x-1/2 w-1 rounded-full ${timeLeft < 10 ? "bg-error" : "bg-white"}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: [0, 20, 0],
                                    opacity: [0, 0.6, 0],
                                    y: [0, 10, 20]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    delay: Math.random() * 2
                                }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
