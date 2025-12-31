import { useSettings } from "@/context/SettingsContext";
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

    const props: TimerProps = { timeLeft, totalTime, isFrozen, className };

    switch (currentStyle) {
        case "hourglass":
            return <HourglassTimer {...props} />;
        case "analogue":
            return <AnalogueTimer {...props} />;
        case "ring":
            return <RingTimer {...props} />;
        case "glitch":
            return <GlitchTimer {...props} />;
        case "fuse":
            return <FuseTimer {...props} />;
        case "melting":
            return <MeltingTimer {...props} />;
        case "digital":
        default:
            return <DigitalTimer {...props} />;
    }
};
