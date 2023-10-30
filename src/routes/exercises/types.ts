import type { Category } from "$src/db/schema/category";
import type { Exercise } from "$src/db/schema/exercise";
import type { Unit } from "$src/db/schema/unit";
import type { Workout } from "$src/db/schema/workout";

export interface PageWorkout extends Workout {
	sets: any[];
	date: Date;
}

export interface PageExercise extends Exercise {
	unit: Unit;
	bestWorkout?: PageWorkout;
	workoutHistory?: PageWorkout[];
}

export type PageMandatoryExercise = Required<PageExercise>;

export interface PageCategory extends Category {
	exercises?: PageExercise[];
}

// could be optimized with maps
export interface PageExercisesData {
	units: Unit[];
	categories: PageCategory[];
}
