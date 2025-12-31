import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLifelineManager } from "./useLifelineManager";

// Mock dependencies
const mockDispatch = vi.fn();
const mockNextQuestion = vi.fn();
const mockSetIsFrozen = vi.fn();
const mockSetIsSimplifyActive = vi.fn();
const mockSetDisabledOptions = vi.fn();

// Mock useSettings
vi.mock("@/context/SettingsContext", () => ({
	useSettings: () => ({
		settings: {
			dismissedLifelineTips: ["skip"], // 'skip' is dismissed, 'freezeTime' is not
		},
		updateDismissedTips: vi.fn(),
	}),
}));

const mockLifelineData = {
	freezeTime: {
		id: "freezeTime",
		name: "Freeze",
		description: "Stop time",
		icon: null,
	},
	skip: { id: "skip", name: "Skip", description: "Skip Q", icon: null },
};

describe("useLifelineManager", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const defaultProps = {
		state: {
			lifelines: {
				freezeTime: true,
				skip: true,
			},
			difficulty: 1,
		},
		dispatch: mockDispatch,
		question: { answer: 10, equation: "5+5" },
		options: [10, 5, 2, 8],
		nextQuestion: mockNextQuestion,
		setIsFrozen: mockSetIsFrozen,
		setIsSimplifyActive: mockSetIsSimplifyActive,
		setDisabledOptions: mockSetDisabledOptions,
		lifelineData: mockLifelineData as any,
	};

	it("should open modal for undismissed lifeline", () => {
		const { result } = renderHook(() => useLifelineManager(defaultProps));

		act(() => {
			result.current.onFreeze();
		});

		// Should pause game
		expect(mockDispatch).toHaveBeenCalledWith({ type: "PAUSE_GAME" });
		// Should set active modal
		expect(result.current.activeLifelineModal?.id).toBe("freezeTime");
	});

	it("should immediately execute action for dismissed lifeline", () => {
		const { result } = renderHook(() => useLifelineManager(defaultProps));

		act(() => {
			result.current.onSkip();
		});

		// Should NOT pause game or open modal
		expect(mockDispatch).toHaveBeenCalledWith({
			type: "USE_LIFELINE",
			payload: { name: "skip" },
		});
		expect(mockNextQuestion).toHaveBeenCalled();
		expect(result.current.activeLifelineModal).toBeNull();
	});

	it("should execute pending action on modal confirm", () => {
		const { result } = renderHook(() => useLifelineManager(defaultProps));

		// Trigger modal
		act(() => {
			result.current.onFreeze();
		});

		// Confirm
		act(() => {
			result.current.handleModalConfirm(true);
		});

		expect(mockDispatch).toHaveBeenCalledWith({
			type: "USE_LIFELINE",
			payload: { name: "freezeTime" },
		});
		expect(mockDispatch).toHaveBeenCalledWith({ type: "RESUME_GAME" });
		expect(mockSetIsFrozen).toHaveBeenCalledWith(true);
		expect(result.current.activeLifelineModal).toBeNull();
	});
});
