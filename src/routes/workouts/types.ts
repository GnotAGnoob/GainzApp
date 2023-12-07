import type { Category } from "$src/db/schema/category";
import type { Exercise } from "$src/db/schema/exercise";
import type { InsertSetWeight } from "$src/db/schema/setWeight";
import type { PageDisplaySupersetExercise, PageSupersetExerciseInfo } from "../exercises/types";

export interface PageSetWeight {
	repetition: string;
	weight: string;
}

// EXERCISE
export interface PageFillSupersetExercise {
	id?: number;
	sets: PageSetWeight[];
	exercise: Exercise & {
		category: Category;
	};
}

export type PageCreateSupersetExercise = Pick<PageFillSupersetExercise, "exercise">;

export type PageSupersetExercise = PageFillSupersetExercise & PageDisplaySupersetExercise & PageSupersetExerciseInfo;

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
	supersets: T[];
}

export type PageCreateWorkout = Omit<PageFillWorkoutGeneric<PageCreateSuperset>, "id">;

export type PageFillWorkout = PageFillWorkoutGeneric<PageFillSuperset>;

export type PageWorkout = Required<PageFillWorkoutGeneric<PageSuperset>>;

export type PagePlannedWorkout = Required<PageFillWorkoutGeneric<PagePlannedSuperset>>;

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
