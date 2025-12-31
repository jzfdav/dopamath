import { useCallback } from "react";
import { useSettings } from "@/context/SettingsContext";
import {
	playErrorSound,
	playSuccessSound,
	playTickSound,
	triggerHaptic,
} from "@/utils/audio";

export const useFeedback = () => {
	const { settings } = useSettings();

	const success = useCallback(() => {
		if (settings.audioTicksEnabled) playSuccessSound();
		if (settings.hapticsEnabled) triggerHaptic("medium");
	}, [settings.audioTicksEnabled, settings.hapticsEnabled]);

	const error = useCallback(() => {
		if (settings.audioTicksEnabled) playErrorSound();
		if (settings.hapticsEnabled) triggerHaptic("heavy");
	}, [settings.audioTicksEnabled, settings.hapticsEnabled]);

	const tick = useCallback(() => {
		if (settings.audioTicksEnabled) playTickSound();
		if (settings.hapticsEnabled) triggerHaptic("light");
	}, [settings.audioTicksEnabled, settings.hapticsEnabled]);

	return { success, error, tick };
};
