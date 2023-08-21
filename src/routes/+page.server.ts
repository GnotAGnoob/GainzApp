export async function load() {
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
		floatedCorner: ["addExercise"],
		nextWorkouts: [
			//todo
		],
		workoutsHistory: [],
		categories: [
			{
				category: "Biceps",
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
				category: "Triceps",
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
		],
	};
}
