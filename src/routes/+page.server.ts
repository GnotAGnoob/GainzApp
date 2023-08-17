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
