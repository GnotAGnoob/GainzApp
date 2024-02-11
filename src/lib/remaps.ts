import type { ExerciseAdditionalInfo } from "$src/lib/stores/exerciseAddionalInfo";
import type { PageFillWorkout, PagePlannedWorkout, PageSetWeight } from "$src/routes/types";

export const remapWorkout = (
	workout: PagePlannedWorkout | PageFillWorkout,
	exerciseAdditionalInfo: ExerciseAdditionalInfo,
) => {
	return {
		...workout,
		supersets: workout.supersets.map((superset) => ({
			...superset,
			supersetExercises: superset.supersetExercises.map((supersetExercise) => {
				const key = supersetExercise.exercise.id;
				const additionalInfo = exerciseAdditionalInfo.get(key);
				let sets: PageSetWeight[] = [];

				if ("sets" in supersetExercise) {
					sets = supersetExercise.sets;
				}

				return {
					...supersetExercise,
					sets,
					exercise: {
						...supersetExercise.exercise,
						bestWorkout: additionalInfo?.bestWorkout,
						workoutHistory: additionalInfo?.workoutHistory,
					},
				};
			}),
		})),
	};
};
