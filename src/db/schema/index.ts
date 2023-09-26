// Purpose: Export all schemas.
import * as account from "./account";
import * as category from "./category";
import * as exercise from "./exercise";
import * as sessions from "./session";
import * as setWeight from "./setWeight";
import * as supersetExercise from "./supersetExercise";
import * as status from "./status";
import * as superset from "./superset";
import * as unit from "./unit";
import * as user from "./user";
import * as verificationTokens from "./verificationTokens";
import * as workout from "./workout";
import * as exerciseSearch from "./exerciseSearch";

export default {
	...account,
	...category,
	...exercise,
	...sessions,
	...setWeight,
	...supersetExercise,
	...status,
	...superset,
	...unit,
	...user,
	...verificationTokens,
	...workout,
	...exerciseSearch,
};
