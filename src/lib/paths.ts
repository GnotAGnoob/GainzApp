import { dictionary } from "./language/dictionary";

export default {
	"/": dictionary.HOME,
	"/create": dictionary.CREATE,
	"/list": dictionary.LIST,
} as const;
