import type { Category } from "$src/db/schema/category";
import type { Exercise } from "$src/db/schema/exercise";

export interface PageFullExercise {
	category: Category;
	exercise: Exercise;
}

export interface PageCreateSuperset {
	exercises: PageFullExercise[];
}

export interface PageSuperset {
	id: number;
	exercises: PageFullExercise[];
}

export interface PageCreateWorkout {
	supersets: PageCreateSuperset[];
}

export interface PagePlannedWorkout extends PageCreateWorkout {
	id: number;
	supersets: PageSuperset[];
}
