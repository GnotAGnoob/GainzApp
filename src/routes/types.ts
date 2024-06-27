import type { Category } from "$src/db/schema/category";
import type { Exercise } from "$src/db/schema/exercise";
import type { InsertSetWeight } from "$src/db/schema/setWeight";
import type { Unit } from "$src/db/schema/unit";
import type { AnimationId } from "$src/lib/types";
import type { PageDisplaySupersetExercise, PageSupersetExerciseInfo } from "./exercises/types";

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

export type PageFillSupersetExercise = PageSupersetExerciseTemplate<PageSupersetExerciseInfo> & AnimationId;

export type PageCreateSupersetExercise = Pick<PageSupersetExerciseTemplate, "exercise">;

export type PageSupersetExercise = PageSupersetExerciseTemplate & PageDisplaySupersetExercise;

export type PagePlannedSupersetExercise = Pick<PageSupersetExercise, "id" | "exercise">;

// SUPERSETS
export interface PageSupersetGeneric<T> {
	id?: number;
	supersetExercises: T[];
}

export type PageCreateSuperset = Omit<PageSupersetGeneric<PageCreateSupersetExercise>, "id">;

export type PageFillSuperset = PageSupersetGeneric<PageFillSupersetExercise> & AnimationId;

export type PagePlannedSuperset = Required<PageSupersetGeneric<PagePlannedSupersetExercise>>;

export type PageSuperset = Required<PageSupersetGeneric<PageSupersetExercise>>;

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

interface PageInsertSupersetExercise {
	id?: number;
	exercise: Pick<Exercise, "id">;
}
export interface PageInsertFillSupersetExercise extends Omit<PageInsertSupersetExercise, "sets"> {
	sets: Pick<InsertSetWeight, "repetition" | "weight">[];
}

export type PageInsertFillSuperset = PageSupersetGeneric<PageInsertFillSupersetExercise>;

export type PageInsertFillWorkout = PageFillWorkoutGeneric<PageInsertFillSuperset>;

type PageInsertPlanSuperset = PageSupersetGeneric<PageInsertSupersetExercise>;

export interface PageInsertPlanWorkout extends Omit<PageFillWorkoutGeneric<PageInsertPlanSuperset>, "date"> {
	order?: number;
}

// PAGE DATA
export interface PagePlannedWorkouts {
	plannedWorkouts: PagePlannedWorkout[];
	workoutHistory: PageWorkout[];
}
