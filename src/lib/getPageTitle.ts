import { dictionary } from "./language/dictionary";

export const getPageTitle = (value?: string | null) => {
	const pageTitle = value?.split("/").pop();
	if (!pageTitle || pageTitle === "/") return dictionary.APP_NAME;

	const capitalizedPageTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);
	const devMode =
		import.meta.env.MODE === "development" || import.meta.env.MODE === "staging"
			? ` (${import.meta.env.MODE})`
			: "";

	return `${dictionary.APP_NAME} - ${capitalizedPageTitle}${devMode}`;
};
