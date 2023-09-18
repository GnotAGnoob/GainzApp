import type { LayoutServerLoad } from "./$types";
import { npm_package_version as npmPackageVersion } from "$env/static/private";

export const load: LayoutServerLoad = async (event) => {
	return {
		session: await event.locals.getSession(),
		version: npmPackageVersion,
	};
};
