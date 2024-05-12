export type workoutType = "default" | "best" | "history" | "history2";

export interface Exercise {
	categoryId: number;
	category: string;
	name: string;
	unit: string;
	errorMessage: string;
}
