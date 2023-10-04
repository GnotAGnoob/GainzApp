import type { Category } from "$src/db/schema/category";
import type { Exercise } from "$src/db/schema/exercise";

export interface PageExercise {
	category: Category;
	exercise: Exercise;
}

export interface PageSupersetExercise extends PageExercise {
	id: number;
}

export interface PageCreateSuperset {
	supersetExercises: PageExercise[];
}

export interface PageSuperset {
	id: number;
	supersetExercises: PageSupersetExercise[];
}

export interface PageCreateWorkout {
	supersets: PageCreateSuperset[];
}

export interface PagePlannedWorkout extends PageCreateWorkout {
	id: number;
	supersets: PageSuperset[];
}

export interface PagePlannedWorkouts {
	plannedWorkouts: PagePlannedWorkout[];
}
