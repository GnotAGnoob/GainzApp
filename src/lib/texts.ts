export const insertInsteadRange = (
	text: string,
	insert: string,
	selectionStart: number | null,
	selectionEnd: number | null,
) => {
	if (selectionStart === null || selectionEnd === null) {
		return text + insert;
	}

	return text.slice(0, selectionStart) + insert + text.slice(selectionEnd);
};
