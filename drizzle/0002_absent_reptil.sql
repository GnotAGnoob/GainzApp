CREATE TABLE IF NOT EXISTS "setWeight" (
	"id" serial PRIMARY KEY NOT NULL,
	"repetition" integer,
	"weight" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"superset_exercise_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "supersetExercise" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"exercise_id" integer NOT NULL,
	"superset_id" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "set";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setWeight" ADD CONSTRAINT "setWeight_superset_exercise_id_supersetExercise_id_fk" FOREIGN KEY ("superset_exercise_id") REFERENCES "supersetExercise"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supersetExercise" ADD CONSTRAINT "supersetExercise_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supersetExercise" ADD CONSTRAINT "supersetExercise_superset_id_superset_id_fk" FOREIGN KEY ("superset_id") REFERENCES "superset"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
