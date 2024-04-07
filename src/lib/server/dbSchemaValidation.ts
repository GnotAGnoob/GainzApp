import { z } from "zod";
import {
	MAX_SETS,
	MAX_SUPERSETS,
	MAX_SUPERSET_EXERCISES,
	MAX_TEXT_LENGTH,
	MAX_WEIGHT_DECIMAL_NUMBERS,
} from "../constants";
import type { PageInsertFillWorkout, PageInsertPlanWorkout } from "$src/routes/types";

// ZOD DEFINITIONS

const createSupersetExerciseObject = z.object({
	exercise: z.object({
		category: z.object({
			id: z.number(),
			name: z.string().max(MAX_TEXT_LENGTH),
			isGlobal: z.boolean(),
		}),
		id: z.number(),
		name: z.string().max(MAX_TEXT_LENGTH),
		isGlobal: z.boolean(),
	}),
});

// const floatNumberParser = (value: string): number => {
// 	const floatValue = parseFloat(value.replace(",", "."));

// 	if (isNaN(floatValue)) {
// 		throw new ZodError([
// 			{
// 				message: "Invalid number format",
// 				path: [],
// 				code: "custom",
// 			},
// 		]);
// 	}

// 	return floatValue;
// };

// const floatNumberSchema = z.string().transform(floatNumberParser);

const fillSupersetExerciseObject = createSupersetExerciseObject.extend({
	id: z.number().int().optional(),
	sets: z
		.array(
			z.object({
				// weight: floatNumberSchema.refine((val) => val >= 0, { message: "Weight must non negative" }),
				weight: z.coerce
					.number()
					.nonnegative()
					.refine(
						(n) => {
							return n.toString().split(".")[1].length <= MAX_WEIGHT_DECIMAL_NUMBERS;
						},
						{ message: `Max precision is ${MAX_WEIGHT_DECIMAL_NUMBERS} decimal places` },
					),
				repetition: z.coerce.number().int().positive(),
			}),
		)
		.nonempty()
		.max(MAX_SETS),
});

// SCHEMA PARSERS
export const parseCreateWorkout = (data: unknown): PageInsertPlanWorkout => {
	const schema = z.object({
		supersets: z
			.array(
				z.object({
					supersetExercises: z.array(createSupersetExerciseObject),
				}),
			)
			.max(MAX_SUPERSETS),
	});

	return schema.parse(data);
};

export const parseFilledWorkout = (data: unknown): PageInsertFillWorkout => {
	const schema = z.object({
		supersets: z
			.array(
				z.object({
					supersetExercises: z.array(fillSupersetExerciseObject),
					id: z.number().optional(),
				}),
			)
			.max(MAX_SUPERSET_EXERCISES),
		date: z.string().optional(),
		id: z.number().optional(),
	});

	return schema.parse(data);
};
