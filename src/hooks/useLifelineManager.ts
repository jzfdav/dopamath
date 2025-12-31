import { useState, useCallback } from "react";
import { useSettings } from "@/context/SettingsContext";
import type { LifelineInfo } from "@/components/LifelineModal";
import type { GameAction } from "@/context/game/types";

export interface LifelineManagerProps {
    state: any;
    dispatch: React.Dispatch<GameAction>;
    question: { answer: number; equation: string } | null;
    options: number[];
    nextQuestion: (difficulty: number) => void;
    setIsFrozen: (val: boolean) => void;
    setIsSimplifyActive: (val: boolean) => void;
    setDisabledOptions: (val: number[]) => void;
    lifelineData: Record<string, LifelineInfo>;
}

export const useLifelineManager = ({
    state,
    dispatch,
    question,
    options,
    nextQuestion,
    setIsFrozen,
    setIsSimplifyActive,
    setDisabledOptions,
    lifelineData
}: LifelineManagerProps) => {
    const { settings, updateDismissedTips } = useSettings();
    const [activeLifelineModal, setActiveLifelineModal] = useState<LifelineInfo | null>(null);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

    const triggerLifeline = useCallback((name: string, action: () => void) => {
        if (!state.lifelines[name as keyof typeof state.lifelines]) return;

        // Check if tip is dismissed
        if (settings.dismissedLifelineTips.includes(name)) {
            dispatch({ type: "USE_LIFELINE", payload: { name: name as any } });
            action();
        } else {
            // Pause game and show modal
            dispatch({ type: "PAUSE_GAME" });
            setPendingAction(() => action);
            setActiveLifelineModal(lifelineData[name]);
        }
    }, [state.lifelines, settings.dismissedLifelineTips, dispatch, lifelineData]);

    const handleModalConfirm = useCallback((dontShowAgain: boolean) => {
        if (activeLifelineModal && dontShowAgain) {
            updateDismissedTips(activeLifelineModal.id);
        }

        if (activeLifelineModal) {
            dispatch({ type: "USE_LIFELINE", payload: { name: activeLifelineModal.id as any } });
        }

        dispatch({ type: "RESUME_GAME" });
        pendingAction?.();
        setActiveLifelineModal(null);
        setPendingAction(null);
    }, [activeLifelineModal, updateDismissedTips, dispatch, pendingAction]);

    const handleModalClose = useCallback((dontShowAgain: boolean) => {
        if (activeLifelineModal && dontShowAgain) {
            updateDismissedTips(activeLifelineModal.id);
        }
        dispatch({ type: "RESUME_GAME" });
        setActiveLifelineModal(null);
        setPendingAction(null);
    }, [activeLifelineModal, updateDismissedTips, dispatch]);

    const onFreeze = () => triggerLifeline("freezeTime", () => setIsFrozen(true));

    const onFiftyFifty = () => triggerLifeline("fiftyFifty", () => {
        if (!question) return;
        const wrongOptions = options.filter((opt) => opt !== question.answer);
        const toDisable = wrongOptions
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);
        setDisabledOptions(toDisable);
    });

    const onSimplify = () => triggerLifeline("simplify", () => setIsSimplifyActive(true));

    const onSkip = () => triggerLifeline("skip", () => nextQuestion(state.difficulty));

    const onShield = () => triggerLifeline("secondChance", () => { });

    return {
        activeLifelineModal,
        handleModalConfirm,
        handleModalClose,
        onFreeze,
        onFiftyFifty,
        onSimplify,
        onSkip,
        onShield
    };
};
