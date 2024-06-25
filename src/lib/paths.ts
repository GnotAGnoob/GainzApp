import { dictionary } from "./language/dictionary";

export default {
	"/": dictionary.WORKOUTS,
	"/exercises": dictionary.EXERCISES,
} as const;

export const apiRoutes = {
	exercise: "/api/exercise/",
	exercises: "/api/exercises/",
	category: "/api/category/",
	exercisesSearch: "/api/exercises/search/",
	exercisesWorkoutHistory: "/api/exercises/workout-history/",
	planWorkout: "/api/workout/plan/",
	completeWorkout: "/api/workout/complete/",
};
