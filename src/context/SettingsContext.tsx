import { createContext, useContext, useEffect, useState } from "react";
import type { ContentMode } from "./GameContext";

export type TimerStyle =
	| "digital"
	| "hourglass"
	| "analogue"
	| "ring"
	| "glitch"
	| "fuse"
	| "melting";

interface Settings {
	hapticsEnabled: boolean;
	audioTicksEnabled: boolean;
	timerStyle: TimerStyle;
	dismissedLifelineTips: string[];
	lastMinutes: number;
	lastContentMode: ContentMode;
}

const DEFAULT_SETTINGS: Settings = {
	hapticsEnabled: true,
	audioTicksEnabled: true,
	timerStyle: "digital",
	dismissedLifelineTips: [],
	lastMinutes: 1,
	lastContentMode: "mixed",
};

const SettingsContext = createContext<{
	settings: Settings;
	updateSettings: (updates: Partial<Settings>) => void;
	updateDismissedTips: (tipId: string) => void;
} | null>(null);

export const SettingsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [settings, setSettings] = useState<Settings>(() => {
		const saved = localStorage.getItem("dopamath_settings");
		return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
	});

	useEffect(() => {
		localStorage.setItem("dopamath_settings", JSON.stringify(settings));
	}, [settings]);

	const updateSettings = (updates: Partial<Settings>) => {
		setSettings((prev) => ({ ...prev, ...updates }));
	};

	const updateDismissedTips = (tipId: string) => {
		setSettings(prev => {
			if (prev.dismissedLifelineTips.includes(tipId)) return prev;
			const next = {
				...prev,
				dismissedLifelineTips: [...prev.dismissedLifelineTips, tipId]
			};
			localStorage.setItem("dopamath_settings", JSON.stringify(next));
			return next;
		});
	};

	return (
		<SettingsContext.Provider value={{ settings, updateSettings, updateDismissedTips }}>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
};
