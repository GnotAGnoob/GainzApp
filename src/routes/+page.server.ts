export async function load() {
	const bestSet = {
		date: "2020-01-01",
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
						name: "Biceps Curl",
						bestSet,
						history: [
							bestSet,
							{
								date: "2020-01-02",
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
