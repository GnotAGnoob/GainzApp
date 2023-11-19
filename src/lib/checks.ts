export const isStringNumber = (value: string) => {
	return !isNaN(Number(value.replace(/,/g, ".")));
};
