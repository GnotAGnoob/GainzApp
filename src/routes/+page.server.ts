import { unit } from "$src/db/schema/unit";
import { user } from "$src/db/schema/user";
import db from "$src/lib/server/db";
import { getUserId } from "$src/lib/server/dbHelpers";
import { handleError } from "$src/lib/server/error";

export async function load({ locals }) {
	try {
		const userId = await getUserId(locals);

		if (userId instanceof Response) {
			return userId;
		}

		// const unitsPromise = db.select({ id: unit.id, name: unit.name }).from(unit);
		// const categoriesPromise = db.query.category.findMany({
		// 	with: {
		// 		user: true,
		// 	},
		// });

		const posts = await db.query.user.findMany({
			with: {
				categories: true,
			},
		});

		console.log(posts);

		// const [units, categories] = await Promise.allSettled([unitsPromise, categoriesPromise]);
		// console.log(units, categories);

		// return {
		// 	floatedCorner: ["addExercise"],
		// 	units,
		// };
	} catch (error) {
		console.log(error);
		// return handleError(error);
	}

	const bestWorkout = {
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
	};

	return {
		nextWorkouts: [
			//todo
		],
		workoutsHistory: [],
		categories: [
			{
				name: "Biceps",
				exercises: [
					{
						name: "Curl",
						bestWorkout,
						history: [
							bestWorkout,
							{
								date: new Date(1692300971241),
								sets: [
									{
										reps: 6,
										weight: 12,
									},
									{
										reps: 10,
										weight: 10,
									},
								],
							},
						],
					},
					{
						name: "Curlna",
						bestWorkout,
						history: [
							bestWorkout,
							{
								date: new Date(),
								sets: [
									{
										reps: 6,
										weight: 12,
									},
								],
							},
							bestWorkout,
						],
					},
					{
						name: "Barbell Curl",
						bestWorkout,
						history: [
							bestWorkout,
							{
								date: new Date(),
								sets: [
									{
										reps: 6,
										weight: 12,
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
						],
					},
					{
						name: "Chin up",
						bestWorkout,
						history: [
							bestWorkout,
							{
								date: new Date(),
								sets: [
									{
										reps: 6,
										weight: 12,
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
							},
						],
					},
					{
						name: "Preacher",
						bestWorkout,
						history: [
							bestWorkout,
							{
								date: new Date(),
								sets: [
									{
										reps: 6,
										weight: 12,
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
						],
					},
					{
						name: "Brachialis",
						bestWorkout,
						history: [
							bestWorkout,
							{
								date: new Date(),
								sets: [
									{
										reps: 6,
										weight: 12,
									},
									{
										reps: 10,
										weight: 10,
									},
								],
							},
						],
					},
				],
			},
			{
				name: "Triceps",
				exercises: [
					{
						name: "Curl",
						bestWorkout,
						history: [
							bestWorkout,
							{
								date: new Date(),
								sets: [
									{
										reps: 6,
										weight: 12,
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
						],
					},
					{
						name: "Curlz",
						bestWorkout,
						history: [
							bestWorkout,
							{
								date: new Date(),
								sets: [
									{
										reps: 6,
										weight: 12,
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
						],
					},
					{
						name: "Barbell Curl",
						bestWorkout,
						history: [
							bestWorkout,
							{
								date: new Date(),
								sets: [
									{
										reps: 6,
										weight: 12,
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
						],
					},
					{
						name: "Chin up",
						bestWorkout,
						history: [
							bestWorkout,
							{
								date: new Date(),
								sets: [
									{
										reps: 6,
										weight: 12,
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
						],
					},
					{
						name: "Preacher",
						bestWorkout,
						history: [
							bestWorkout,
							{
								date: new Date(),
								sets: [
									{
										reps: 6,
										weight: 12,
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
						],
					},
					{
						name: "Brachialis",
						bestWorkout,
						history: [
							bestWorkout,
							{
								date: new Date(),
								sets: [
									{
										reps: 6,
										weight: 12,
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
						],
					},
				],
			},
			{
				name: "xx",
			},
		],
	};
}
