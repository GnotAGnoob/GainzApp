import type { Category } from "$src/db/schema/category";
import type { Exercise } from "$src/db/schema/exercise";
import type { InsertSetWeight } from "$src/db/schema/setWeight";
import type { Unit } from "$src/db/schema/unit";
import type { PageDisplaySupersetExercise, PageSupersetExerciseInfo } from "../exercises/types";

export interface PageSetWeight {
	repetition: string;
	weight: string;
}

// EXERCISE
interface PageSupersetExerciseTemplate<T = object> {
	id?: number;
	sets: PageSetWeight[];
	exercise: Exercise &
		T & {
			category: Category;
			unit: Unit;
		};
}

export type PageFillSupersetExercise = PageSupersetExerciseTemplate<PageSupersetExerciseInfo>;

export type PageCreateSupersetExercise = Pick<PageSupersetExerciseTemplate, "exercise">;

export type PageSupersetExercise = PageSupersetExerciseTemplate & PageDisplaySupersetExercise;

export type PagePlannedSupersetExercise = Pick<PageSupersetExercise, "id" | "exercise">;

// Server
export interface PageInsertFillSupersetExercise extends Omit<PageFillSupersetExercise, "sets"> {
	sets: Pick<InsertSetWeight, "repetition" | "weight">[];
}

// SUPERSETS
export interface PageSupersetGeneric<T> {
	id?: number;
	supersetExercises: T[];
}

export type PageCreateSuperset = Omit<PageSupersetGeneric<PageCreateSupersetExercise>, "id">;

export type PageFillSuperset = PageSupersetGeneric<PageFillSupersetExercise>;

export type PagePlannedSuperset = Required<PageSupersetGeneric<PagePlannedSupersetExercise>>;

export type PageSuperset = Required<PageSupersetGeneric<PageSupersetExercise>>;

// Server
export type PageInsertFillSuperset = PageSupersetGeneric<PageInsertFillSupersetExercise>;

// WORKOUTS
export interface PageFillWorkoutGeneric<T> {
	id?: number;
	date?: string;
	supersets: T[];
}

export type PageCreateWorkout = Omit<PageFillWorkoutGeneric<PageCreateSuperset>, "id" | "date">;

export type PageFillWorkout = Omit<PageFillWorkoutGeneric<PageFillSuperset>, "date">;

export type PageWorkout = Required<PageFillWorkoutGeneric<PageSuperset>>;

export type PagePlannedWorkout = Omit<Required<PageFillWorkoutGeneric<PagePlannedSuperset>>, "date">;

// Server

export type PageInsertFillWorkout = PageFillWorkoutGeneric<PageInsertFillSuperset>;

export interface PageInsertPlanWorkout extends PageCreateWorkout {
	order?: number;
}

// PAGE DATA
export interface PagePlannedWorkouts {
	plannedWorkouts: PagePlannedWorkout[];
	workoutHistory: PageWorkout[];
}
