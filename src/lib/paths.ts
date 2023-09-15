import { dictionary } from "./language/dictionary";

export default {
	"/": dictionary.HOME,
	"/exercises": dictionary.EXERCISES,
	"/workouts": dictionary.WORKOUTS,
} as const;
