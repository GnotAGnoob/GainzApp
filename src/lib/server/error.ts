import postgres from "postgres";
import { z } from "zod";
import { dictionary } from "../language/dictionary";
import { HttpError, error } from "@sveltejs/kit";

export const handleError = (err: unknown, errorHandling?: () => HttpError | undefined) => {
	// eslint-disable-next-line no-console
	console.log(err);

	if (err instanceof z.ZodError) {
		return error(422, err.errors[0].message);
	}

	if (err instanceof postgres.PostgresError) {
		// duplicate key
		if (err.code === "23505") {
			return error(409, dictionary.ALREADY_EXIST);
		}
	}

	const response = errorHandling?.();

	if (response) {
		return response;
	}

	let errorMessage = dictionary.UNKNOWN_ERROR;

	if (err instanceof Error) {
		errorMessage = err.message;
	} else if (typeof err === "string") {
		errorMessage = err;
	} else if (err instanceof Response) {
		return error(err.status, err.statusText);
	} else if (err instanceof Object) {
		// @ts-ignore
		if (err.message) {
			// @ts-ignore
			errorMessage = err.message;
		} else {
			errorMessage = JSON.stringify(err);
		}
	}

	return error(500, errorMessage);
};
