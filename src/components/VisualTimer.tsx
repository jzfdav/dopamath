import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { triggerHaptic } from "@/utils/audio";
import type { TimerProps } from "./timers/types";
import { DigitalTimer } from "./timers/DigitalTimer";
import { HourglassTimer } from "./timers/HourglassTimer";
import { AnalogueTimer } from "./timers/AnalogueTimer";
import { RingTimer } from "./timers/RingTimer";
import { GlitchTimer } from "./timers/GlitchTimer";
import { FuseTimer } from "./timers/FuseTimer";
import { MeltingTimer } from "./timers/MeltingTimer";

interface VisualTimerProps extends Omit<TimerProps, "totalTime"> {
    totalTime?: number;
    styleOverride?: string;
}

export const VisualTimer = ({
    timeLeft,
    totalTime = 60,
    isFrozen = false,
    className = "",
    styleOverride
}: VisualTimerProps) => {
    const { settings } = useSettings();
    const currentStyle = styleOverride || settings.timerStyle;
    const [pops, setPops] = useState<{ id: number; text: string }[]>([]);
    const prevTimeRef = useRef(timeLeft);

    useEffect(() => {
        if (timeLeft > prevTimeRef.current) {
            // Time was added!
            const id = Date.now();
            const diff = timeLeft - prevTimeRef.current;
            setPops(prev => [...prev, { id, text: `+${diff}s` }]);

            // Haptic feedback for the clutch moment
            triggerHaptic("medium");

            // Clean up pop after animation
            setTimeout(() => {
                setPops(prev => prev.filter(p => p.id !== id));
            }, 1000);
        }
        prevTimeRef.current = timeLeft;
    }, [timeLeft]);

    const props: TimerProps = { timeLeft, totalTime, isFrozen, className };

    const renderTimer = () => {
        switch (currentStyle) {
            case "hourglass": return <HourglassTimer {...props} />;
            case "analogue": return <AnalogueTimer {...props} />;
            case "ring": return <RingTimer {...props} />;
            case "glitch": return <GlitchTimer {...props} />;
            case "fuse": return <FuseTimer {...props} />;
            case "melting": return <MeltingTimer {...props} />;
            case "digital":
            default:
                return <DigitalTimer {...props} />;
        }
    };

    return (
        <motion.div
            className="relative inline-block"
            animate={pops.length > 0 ? {
                scale: [1, 1.1, 1],
                filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
            } : {}}
            transition={{ duration: 0.3 }}
        >
            {renderTimer()}

            <AnimatePresence>
                {pops.map(pop => (
                    <motion.span
                        key={pop.id}
                        initial={{ opacity: 0, y: 0, x: 20, scale: 0.5 }}
                        animate={{ opacity: 1, y: -40, x: 30, scale: 1.2 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="absolute top-0 right-0 text-primary font-black text-xl italic drop-shadow-neon pointer-events-none"
                    >
                        {pop.text}
                    </motion.span>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};
