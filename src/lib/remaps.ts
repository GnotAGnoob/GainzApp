import type { ExerciseAdditionalInfo } from "$src/lib/stores/exerciseAddionalInfo";
import type { PageFillWorkout, PagePlannedWorkout, PageSetWeight } from "$src/routes/types";

export const remapWorkout = (
	workout: PagePlannedWorkout | PageFillWorkout,
	exerciseAdditionalInfo: ExerciseAdditionalInfo,
): PageFillWorkout => {
	return {
		...workout,
		supersets: workout.supersets.map((superset) => ({
			...superset,
			animationId: "animationId" in superset ? superset.animationId : Math.random().toString(),
			supersetExercises: superset.supersetExercises.map((supersetExercise) => {
				const key = supersetExercise.exercise.id;
				const additionalInfo = exerciseAdditionalInfo.get(key);
				let sets: PageSetWeight[] = [];

				if ("sets" in supersetExercise) {
					sets = supersetExercise.sets;
				}

				return {
					...supersetExercise,
					animationId:
						"animationId" in supersetExercise ? supersetExercise.animationId : Math.random().toString(),
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
