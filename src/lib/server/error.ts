import postgres from "postgres";
import { z } from "zod";
import { dictionary } from "../language/dictionary";

export const handleError = (error: unknown, errorHandling?: () => Response | undefined) => {
	// eslint-disable-next-line no-console
	console.log(error);

	if (error instanceof z.ZodError) {
		return new Response(error.errors[0].message, { status: 422 });
	}

	if (error instanceof postgres.PostgresError) {
		// duplicate key
		if (error.code === "23505") {
			return new Response(dictionary.ALREADY_EXIST, { status: 409 });
		}
	}

	const response = errorHandling?.();

	if (response) {
		return response;
	}

	let errorMessage = dictionary.UNKNOWN_ERROR;

	if (error instanceof Error) {
		errorMessage = error.message;
	} else if (typeof error === "string") {
		errorMessage = error;
	} else if (error instanceof Response) {
		return error;
	} else if (error instanceof Object) {
		// @ts-ignore
		if (error.message) {
			// @ts-ignore
			errorMessage = error.message;
		} else {
			errorMessage = JSON.stringify(error);
		}
	}

	return new Response(errorMessage, { status: 500 });
};
