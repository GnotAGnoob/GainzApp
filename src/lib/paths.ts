import { dictionary } from "./language/dictionary";

export default {
	"/": dictionary.HOME,
	"/exercises": dictionary.EXERCISES,
	"/workouts": dictionary.WORKOUTS,
} as const;

export const apiRoutes = {
	exercise: "/api/exercise/",
	category: "/api/category/",
};
