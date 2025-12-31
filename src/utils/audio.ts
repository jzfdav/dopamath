// Simple audio synth for UI sound effects
// Avoids external assets for snappy performance

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
	if (!audioContext) {
		audioContext = new (
			window.AudioContext || (window as any).webkitAudioContext
		)();
	}
	return audioContext;
};

export const playTickSound = () => {
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
	} catch (e) {
		// Silently fail if audio is not supported/blocked
	}
};

export const triggerHaptic = () => {
	if (navigator.vibrate) {
		navigator.vibrate(5); // Very short pulse
	}
};
