import { createContext, useContext, useEffect, useState } from "react";

interface Settings {
	hapticsEnabled: boolean;
	audioTicksEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
	hapticsEnabled: true,
	audioTicksEnabled: true,
};

const SettingsContext = createContext<{
	settings: Settings;
	updateSettings: (updates: Partial<Settings>) => void;
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

	return (
		<SettingsContext.Provider value={{ settings, updateSettings }}>
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
