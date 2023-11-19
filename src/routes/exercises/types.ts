import type { Category } from "$src/db/schema/category";
import type { Exercise } from "$src/db/schema/exercise";
import type { InsertSetWeight } from "$src/db/schema/setWeight";
import type { Unit } from "$src/db/schema/unit";

export interface PageWorkoutWeightSet extends InsertSetWeight {
	id: number;
}

export interface PageWorkout {
	id: number;
	sets: PageWorkoutWeightSet[];
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
