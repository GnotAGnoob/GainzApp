export const isStringNumber = (value: string) => {
	if (value[0] === "0" && ![".", undefined].includes(value[1])) {
		return false;
	}

	return !isNaN(Number(value));
};
