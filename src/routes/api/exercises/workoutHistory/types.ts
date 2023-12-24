import type { PageSupersetExerciseInfo } from "$src/routes/exercises/types";

export interface WorkoutHistory extends Omit<PageSupersetExerciseInfo, "unit"> {
	id: number;
}
