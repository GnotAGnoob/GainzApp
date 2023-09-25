import type { Category } from "$src/db/schema/category";
import type { Exercise } from "$src/db/schema/exercise";

export type PageFullExercise = {
	category: Category;
	exercise: Exercise;
};
