import type { Category } from "$src/db/schema/category";
import type { Exercise } from "$src/db/schema/exercise";

export interface PageCreateSetWeight {
	repetition: string;
	weight: string;
}

export interface PageExercise {
	category: Category;
	exercise: Exercise;
}

export interface PageCreateExercise extends PageExercise {
	sets?: PageCreateSetWeight[];
}

export interface PageSupersetExercise extends PageExercise {
	id: number;
}

export interface PageCreateSuperset {
	id?: number;
	supersetExercises: PageCreateExercise[];
}

export interface PageSuperset {
	id: number;
	supersetExercises: PageSupersetExercise[];
}

export interface PageCreateWorkout {
	id?: number;
	supersets: PageCreateSuperset[];
}

export interface PageInsertWorkout extends PageCreateWorkout {
	order?: number;
}

export interface PagePlannedWorkout {
	id: number;
	supersets: PageSuperset[];
}

export interface PagePlannedWorkouts {
	plannedWorkouts: PagePlannedWorkout[];
}
