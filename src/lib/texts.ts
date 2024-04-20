import { MAX_INPUT_NUMBER_LENGTH } from "./constants";

export const insertInsteadRange = (
	text: string,
	insert: string,
	selectionStart: number | null,
	selectionEnd: number | null,
) => {
	const maxInsertLength = MAX_INPUT_NUMBER_LENGTH - text.length + (selectionEnd || 0) - (selectionStart || 0);
	const slicedInsert = insert.slice(0, Math.max(maxInsertLength, 0));

	if (selectionStart === null || selectionEnd === null) {
		return text + slicedInsert;
	}

	return text.slice(0, selectionStart) + slicedInsert + text.slice(selectionEnd);
};
