import type { Category } from "$src/db/schema/category";
import type { Exercise } from "$src/db/schema/exercise";
import type { Unit } from "$src/db/schema/unit";

export interface ExerciseSearchResult {
	exercise: Exercise;
	category: Category;
	unit: Unit;
}
