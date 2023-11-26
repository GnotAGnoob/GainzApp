import { z } from "zod";
import { MAX_SETS, MAX_TEXT_LENGTH } from "../constants";
import type { PageCreateWorkout, PageInsertFillWorkout } from "$src/routes/workouts/types";

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

const fillSupersetExerciseObject = createSupersetExerciseObject.extend({
	id: z.number().optional(),
	sets: z
		.array(
			z.object({
				weight: z.coerce.number().nonnegative(),
				repetition: z.coerce.number().positive(),
			}),
		)
		.nonempty()
		.max(MAX_SETS),
});

// SCHEMA PARSERS

export const parseCreateWorkout = (data: unknown): PageCreateWorkout => {
	const schema = z.object({
		supersets: z.array(
			z.object({
				supersetExercises: z.array(createSupersetExerciseObject),
			}),
		),
	});

	return schema.parse(data);
};

export const parseFilledWorkout = (data: unknown): PageInsertFillWorkout => {
	const schema = z.object({
		supersets: z.array(
			z.object({
				supersetExercises: z.array(fillSupersetExerciseObject),
				id: z.number().optional(),
			}),
		),
		id: z.number().optional(),
	});

	return schema.parse(data);
};
