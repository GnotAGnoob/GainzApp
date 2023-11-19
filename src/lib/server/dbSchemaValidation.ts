import { z } from "zod";
import { MAX_TEXT_LENGTH } from "../constants";
import type { PageCreateWorkout } from "$src/routes/workouts/types";

export const parseCreateWorkout = (parseData: unknown): PageCreateWorkout => {
	const schema = z.object({
		supersets: z.array(
			z.object({
				supersetExercises: z.array(
					z.object({
						category: z.object({
							id: z.number(),
							name: z.string().max(MAX_TEXT_LENGTH),
							isGlobal: z.boolean(),
						}),
						exercise: z.object({
							id: z.number(),
							name: z.string().max(MAX_TEXT_LENGTH),
							isGlobal: z.boolean(),
						}),
					}),
				),
			}),
		),
	});

	return schema.parse(parseData);
};

export const parseWorkout = (parseData: unknown): PageCreateWorkout => {
	const schema = z.object({
		supersets: z.array(
			z.object({
				supersetExercises: z.array(
					z.object({
						category: z.object({
							id: z.number(),
							name: z.string().max(MAX_TEXT_LENGTH),
							isGlobal: z.boolean(),
						}),
						exercise: z.object({
							id: z.number(),
							name: z.string().max(MAX_TEXT_LENGTH),
							isGlobal: z.boolean(),
						}),
					}),
				),
			}),
		),
	});

	return schema.parse(parseData);
};
