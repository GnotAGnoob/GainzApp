import type { Category } from "$src/db/schema/category";
import type { Exercise } from "$src/db/schema/exercise";

export interface ExerciseSearchResult {
	exercise: Exercise;
	category: Category;
}
