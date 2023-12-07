import type { Category } from "$src/db/schema/category";
import type { Exercise } from "$src/db/schema/exercise";
import type { SetWeight } from "$src/db/schema/setWeight";
import type { Unit } from "$src/db/schema/unit";

export interface PageDisplaySupersetExercise {
	id: number;
	sets: SetWeight[];
	date: string;
}

export interface PageSupersetExerciseInfo {
	unit: Unit;
	bestWorkout?: PageDisplaySupersetExercise;
	workoutHistory?: PageDisplaySupersetExercise[];
}

export type PageExercise = Exercise & PageSupersetExerciseInfo;

export type PageMandatoryExercise = Required<PageExercise>;

export interface PageCategory extends Category {
	exercises?: PageExercise[];
}

// could be optimized with maps
export interface PageExercisesData {
	units: Unit[];
	categories: PageCategory[];
}
