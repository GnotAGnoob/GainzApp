import { z } from "zod";

export const handleError = (error: unknown, errorHandling?: () => Response | undefined) => {
	// eslint-disable-next-line no-console
	console.log(error);

	if (error instanceof z.ZodError) {
		return new Response(error.message, { status: 422 });
	}

	const response = errorHandling?.();

	if (response) {
		return response;
	}

	return new Response("Unknown error", { status: 500 });
};
