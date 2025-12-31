// Simple audio synth for UI sound effects
// Avoids external assets for snappy performance

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
	if (!audioContext) {
		audioContext = new (
			window.AudioContext ||
			(
				window as unknown as {
					webkitAudioContext: typeof AudioContext;
				}
			).webkitAudioContext
		)();
	}
	return audioContext;
};

export const playTickSound = () => {
	// Check settings from localStorage for non-reactive utility
	const saved = localStorage.getItem("dopamath_settings");
	const settings = saved ? JSON.parse(saved) : { audioTicksEnabled: true };
	if (!settings.audioTicksEnabled) return;

	try {
		const ctx = getAudioContext();
		if (ctx.state === "suspended") {
			ctx.resume();
		}

		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		// High frequency "tick"
		osc.type = "sine";
		osc.frequency.setValueAtTime(800, ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

		// Short envelope
		gain.gain.setValueAtTime(0.1, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start();
		osc.stop(ctx.currentTime + 0.05);
	} catch (_e) {
		// Silently fail if audio is not supported/blocked
	}
};

export const playSuccessSound = () => {
	const saved = localStorage.getItem("dopamath_settings");
	const settings = saved ? JSON.parse(saved) : { audioTicksEnabled: true };
	if (!settings.audioTicksEnabled) return;

	try {
		const ctx = getAudioContext();
		if (ctx.state === "suspended") ctx.resume();

		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = "sine";
		osc.frequency.setValueAtTime(440, ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

		gain.gain.setValueAtTime(0.1, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start();
		osc.stop(ctx.currentTime + 0.1);
	} catch (_e) {}
};

export const playErrorSound = () => {
	const saved = localStorage.getItem("dopamath_settings");
	const settings = saved ? JSON.parse(saved) : { audioTicksEnabled: true };
	if (!settings.audioTicksEnabled) return;

	try {
		const ctx = getAudioContext();
		if (ctx.state === "suspended") ctx.resume();

		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = "sawtooth";
		osc.frequency.setValueAtTime(150, ctx.currentTime);
		osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);

		gain.gain.setValueAtTime(0.1, ctx.currentTime);
		gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.2);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start();
		osc.stop(ctx.currentTime + 0.2);
	} catch (_e) {}
};

export const triggerHaptic = (
	intensity: "light" | "medium" | "heavy" = "light",
) => {
	const saved = localStorage.getItem("dopamath_settings");
	const settings = saved ? JSON.parse(saved) : { hapticsEnabled: true };
	if (!settings.hapticsEnabled) return;

	if (navigator.vibrate) {
		const duration =
			intensity === "light" ? 5 : intensity === "medium" ? 20 : 50;
		navigator.vibrate(duration);
	}
};
