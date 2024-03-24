import { DATABASE_URL } from "$env/static/private";
import { connectDbDev, connectDbProduction } from "$src/db/connect";
import { envError } from "../error";

if (!DATABASE_URL) throw envError("DATABASE_URL");

// todo add build back to check
// eslint-disable-next-line no-console
console.log("DATABASE_URL", import.meta.env.MODE);

if (!global._db || !global._dbConnection) {
	const db = import.meta.env.MODE === "development" ? connectDbDev(DATABASE_URL) : connectDbProduction(DATABASE_URL);

	global._db = db.db;
	global._dbConnection = db.dbConnection;
}

export default global._db;
export const db = global._dbConnection;
export const connection = global._dbConnection;
