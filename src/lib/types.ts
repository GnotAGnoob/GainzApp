export type StylesType =
	| "negative"
	| "positive"
	| "neutral"
	| "neutral_2"
	| "neutral_3"
	| "info"
	| "background"
	| "inherit";

type InputEventType<E, T extends EventTarget> = E & {
	currentTarget: EventTarget & T;
};

export type KeyboardEventType<T extends EventTarget> = InputEventType<KeyboardEvent, T>;
export type ClipboardEventType<T extends EventTarget> = InputEventType<ClipboardEvent, T>;
export type InputEventType<T extends EventTarget> = InputEventType<InputEvent, T>;
