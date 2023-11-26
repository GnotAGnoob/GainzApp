export type StylesType = "negative" | "positive" | "neutral" | "neutral_2" | "info" | "background";

type InputEventType<E, T extends EventTarget> = E & {
	currentTarget: EventTarget & T;
};

export type KeyboardEventType<T extends EventTarget> = InputEventType<KeyboardEvent, T>;
export type ClipboardEventType<T extends EventTarget> = InputEventType<ClipboardEvent, T>;
