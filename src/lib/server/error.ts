import { PostgresError } from "postgres";
import { z } from "zod";
import { dictionary } from "../language/dictionary";

export const handleError = (error: unknown, errorHandling?: () => Response | undefined) => {
	// eslint-disable-next-line no-console
	console.log(error);

	if (error instanceof z.ZodError) {
		return new Response(error.errors[0].message, { status: 422 });
	}

	if (error instanceof PostgresError) {
		console.log(error.code);
		// duplicate key
		if (error.code === "23505") {
			console.log("XXXXXXXXXX ", error);
			return new Response(dictionary.ALREADY_EXIST, { status: 409 });
		}
	}

	const response = errorHandling?.();

	if (response) {
		console.log("response", response);
		return response;
	}

	return new Response(dictionary.UNKNOWN_ERROR, { status: 500 });
};
