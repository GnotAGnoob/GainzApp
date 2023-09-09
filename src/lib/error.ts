export const envError = (name: string) => {
	return new Error(`Missing ${name} env variable!`);
};

export const errorMessageLongText = (name: string, maxLength: number) => {
	return `${name} must be less than ${maxLength} characters`;
};
