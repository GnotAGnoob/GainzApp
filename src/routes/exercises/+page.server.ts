import { category } from "$src/db/schema/category.js";
import { unit } from "$src/db/schema/unit";
import db from "$src/lib/server/db";
import { dbQueryOmit, getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error";
import { eq, sql } from "drizzle-orm";
import type { HomePageData } from "./types.js";

export async function load({ locals }): Promise<HomePageData | Response> {
	try {
		const userId = await getUserId(locals);

		if (userId instanceof Response) {
			return userId;
		}

		const unitsPromise = db.select({ id: unit.id, name: unit.name }).from(unit);

		// todo dokoncit query
		const categoriesPromise = db.query.category.findMany({
			columns: dbQueryOmit,
			where: eq(category.userId, userId),
			with: {
				exercises: {
					columns: { ...dbQueryOmit, categoryId: false, unitId: false },
					with: {
						unit: {
							columns: dbQueryOmit,
						},
					},
				},
			},
		});

		const [units, categories] = await Promise.all([unitsPromise, categoriesPromise]);

		categories[0].exercises[0].workoutHistory = [
			{
				date: new Date(),
				sets: [
					{
						reps: 11,
						weight: 10,
					},
					{
						reps: 10,
						weight: 10,
					},
					{
						reps: 9,
						weight: 10,
					},
					{
						reps: 10,
						weight: 10,
					},
					{
						reps: 9,
						weight: 10,
					},
				],
			},
			{
				date: new Date(),
				sets: [
					{
						reps: 6,
						weight: 12,
					},
				],
			},
			{
				date: new Date(),
				sets: [
					{
						reps: 11,
						weight: 10,
					},
					{
						reps: 10,
						weight: 10,
					},
					{
						reps: 9,
						weight: 10,
					},
				],
			},
		];

		categories[0].exercises[0].bestWorkout = {
			date: new Date(),
			sets: [
				{
					reps: 11,
					weight: 10,
				},
				{
					reps: 10,
					weight: 10,
				},
				{
					reps: 9,
					weight: 10,
				},
				{
					reps: 10,
					weight: 10,
				},
				{
					reps: 9,
					weight: 10,
				},
				{
					reps: 10,
					weight: 10,
				},
				{
					reps: 9,
					weight: 10,
				},
			],
		};

		// console.log(categories[0].exercises);

		return {
			units,
			categories,
		};
	} catch (error) {
		return handleError(error);
	}

	// const bestWorkout = {
	// 	date: new Date(),
	// 	sets: [
	// 		{
	// 			reps: 11,
	// 			weight: 10,
	// 		},
	// 		{
	// 			reps: 10,
	// 			weight: 10,
	// 		},
	// 		{
	// 			reps: 9,
	// 			weight: 10,
	// 		},
	// 	],
	// };

	// return {
	// 	nextWorkouts: [
	// 		//todo
	// 	],
	// 	workoutsHistory: [],
	// 	categories: [
	// 		{
	// 			name: "Biceps",
	// 			exercises: [
	// 				{
	// 					name: "Curl",
	// 					bestWorkout,
	// 					history: [
	// 						bestWorkout,
	// 						{
	// 							date: new Date(1692300971241),
	// 							sets: [
	// 								{
	// 									reps: 6,
	// 									weight: 12,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 				{
	// 					name: "Curlna",
	// 					bestWorkout,
	// 					history: [
	// 						bestWorkout,
	// 						{
	// 							date: new Date(),
	// 							sets: [
	// 								{
	// 									reps: 6,
	// 									weight: 12,
	// 								},
	// 							],
	// 						},
	// 						bestWorkout,
	// 					],
	// 				},
	// 				{
	// 					name: "Barbell Curl",
	// 					bestWorkout,
	// 					history: [
	// 						bestWorkout,
	// 						{
	// 							date: new Date(),
	// 							sets: [
	// 								{
	// 									reps: 6,
	// 									weight: 12,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 				{
	// 					name: "Chin up",
	// 					bestWorkout,
	// 					history: [
	// 						bestWorkout,
	// 						{
	// 							date: new Date(),
	// 							sets: [
	// 								{
	// 									reps: 6,
	// 									weight: 12,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 				{
	// 					name: "Preacher",
	// 					bestWorkout,
	// 					history: [
	// 						bestWorkout,
	// 						{
	// 							date: new Date(),
	// 							sets: [
	// 								{
	// 									reps: 6,
	// 									weight: 12,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 				{
	// 					name: "Brachialis",
	// 					bestWorkout,
	// 					history: [
	// 						bestWorkout,
	// 						{
	// 							date: new Date(),
	// 							sets: [
	// 								{
	// 									reps: 6,
	// 									weight: 12,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 			],
	// 		},
	// 		{
	// 			name: "Triceps",
	// 			exercises: [
	// 				{
	// 					name: "Curl",
	// 					bestWorkout,
	// 					history: [
	// 						bestWorkout,
	// 						{
	// 							date: new Date(),
	// 							sets: [
	// 								{
	// 									reps: 6,
	// 									weight: 12,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 				{
	// 					name: "Curlz",
	// 					bestWorkout,
	// 					history: [
	// 						bestWorkout,
	// 						{
	// 							date: new Date(),
	// 							sets: [
	// 								{
	// 									reps: 6,
	// 									weight: 12,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 				{
	// 					name: "Barbell Curl",
	// 					bestWorkout,
	// 					history: [
	// 						bestWorkout,
	// 						{
	// 							date: new Date(),
	// 							sets: [
	// 								{
	// 									reps: 6,
	// 									weight: 12,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 				{
	// 					name: "Chin up",
	// 					bestWorkout,
	// 					history: [
	// 						bestWorkout,
	// 						{
	// 							date: new Date(),
	// 							sets: [
	// 								{
	// 									reps: 6,
	// 									weight: 12,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 				{
	// 					name: "Preacher",
	// 					bestWorkout,
	// 					history: [
	// 						bestWorkout,
	// 						{
	// 							date: new Date(),
	// 							sets: [
	// 								{
	// 									reps: 6,
	// 									weight: 12,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 				{
	// 					name: "Brachialis",
	// 					bestWorkout,
	// 					history: [
	// 						bestWorkout,
	// 						{
	// 							date: new Date(),
	// 							sets: [
	// 								{
	// 									reps: 6,
	// 									weight: 12,
	// 								},
	// 								{
	// 									reps: 10,
	// 									weight: 10,
	// 								},
	// 								{
	// 									reps: 9,
	// 									weight: 10,
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 			],
	// 		},
	// 		{
	// 			name: "xx",
	// 		},
	// 	],
	// };
}
