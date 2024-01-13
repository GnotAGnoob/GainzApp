ALTER TABLE "supersetExercise" DROP CONSTRAINT "supersetExercise_exercise_id_exercise_id_fk";
--> statement-breakpoint
ALTER TABLE "supersetExercise" ALTER COLUMN "exercise_id" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supersetExercise" ADD CONSTRAINT "supersetExercise_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
