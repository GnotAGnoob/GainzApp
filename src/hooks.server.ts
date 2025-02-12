import Google from "@auth/core/providers/google";
import { SvelteKitAuth } from "@auth/sveltekit";
import { env } from "$env/dynamic/private";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "$src/lib/server/db";

import { envError } from "$src/lib/error";
import { sequence } from "@sveltejs/kit/hooks";
import { redirect, type Handle } from "@sveltejs/kit";

if (import.meta.env.MODE === "ci") {
	env.GOOGLE_ID = "google-id";
	env.GOOGLE_SECRET = "google-secret";
}

if (!env.GOOGLE_ID) throw envError("GOOGLE_ID");

if (!env.GOOGLE_SECRET) throw envError("GOOGLE_SECRET");

const authHandler = SvelteKitAuth({
	adapter: DrizzleAdapter(db),
	providers: [Google({ clientId: env.GOOGLE_ID, clientSecret: env.GOOGLE_SECRET })],
});

const authorization: Handle = async ({ event, resolve }) => {
	const session = await event.locals.getSession();
	if (!event.url.pathname.startsWith("/auth")) {
		// Protect any routes
		if (!session) {
			if (event.url.pathname.startsWith("/api")) {
				return new Response("Unauthorized", { status: 401 });
			}

			throw redirect(303, "/auth/login");
		}
	}

	if (event.url.pathname.startsWith("/auth/login")) {
		if (session) {
			throw redirect(303, "/");
		}
	}

	// If the request is still here, just proceed as normally
	return resolve(event);
};

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(authHandler, authorization);
