// Purpose: Export all schemas.
import * as account from "./account";
import * as category from "./category";
import * as exercise from "./exercise";
import * as sessions from "./session";
import * as set from "./set";
import * as status from "./status";
import * as superset from "./superset";
import * as unit from "./unit";
import * as user from "./user";
import * as verificationTokens from "./verificationTokens";
import * as workout from "./workout";

export default {
	...account,
	...category,
	...exercise,
	...sessions,
	...set,
	...status,
	...superset,
	...unit,
	...user,
	...verificationTokens,
	...workout,
};
