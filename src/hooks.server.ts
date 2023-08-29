import { prepareStylesSSR } from "@svelteuidev/core";
import Google from "@auth/core/providers/google";
import { SvelteKitAuth } from "@auth/sveltekit";
import { GOOGLE_ID, GOOGLE_SECRET } from "$env/static/private";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "$src/lib/server/db";

import { envError } from "$src/lib/error";
import { sequence } from "@sveltejs/kit/hooks";
import { redirect, type Handle } from "@sveltejs/kit";

if (!GOOGLE_ID) throw envError("GOOGLE_ID");

if (!GOOGLE_SECRET) throw envError("GOOGLE_SECRET");

const authHandler = SvelteKitAuth({
	adapter: DrizzleAdapter(db),
	providers: [Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET })],
});

const authorization: Handle = async ({ event, resolve }) => {
	if (!event.url.pathname.startsWith("/auth")) {
		// Protect any routes under /authenticated
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, "/auth/login");
		}
	}

	// If the request is still here, just proceed as normally
	return resolve(event);
};

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(prepareStylesSSR, authHandler, authorization);
