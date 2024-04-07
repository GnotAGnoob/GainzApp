export type StylesType =
	| "negative"
	| "positive"
	| "neutral"
	| "neutral_2"
	| "neutral_3"
	| "info"
	| "background"
	| "inherit";

type InputEventTemplate<E, T extends EventTarget> = E & {
	currentTarget: EventTarget & T;
};

export type KeyboardEventType<T extends EventTarget> = InputEventTemplate<KeyboardEvent, T>;
export type ClipboardEventType<T extends EventTarget> = InputEventTemplate<ClipboardEvent, T>;
export type InputEventType<T extends EventTarget> = InputEventTemplate<InputEvent, T>;
