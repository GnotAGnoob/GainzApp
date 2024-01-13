ALTER TABLE "supersetExercise" DROP CONSTRAINT "supersetExercise_exercise_id_exercise_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "supersetExercise" ADD CONSTRAINT "supersetExercise_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "exercise"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
