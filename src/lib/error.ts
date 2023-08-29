export const envError = (name: string) => {
	return new Error(`Missing ${name} env variable!`);
};
