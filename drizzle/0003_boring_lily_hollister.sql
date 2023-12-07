ALTER TABLE "setWeight" ALTER COLUMN "repetition" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "setWeight" ALTER COLUMN "weight" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "superset" ADD CONSTRAINT "superset_workout_id_order_unique" UNIQUE("workout_id","order");--> statement-breakpoint
ALTER TABLE "workout" ADD CONSTRAINT "workout_status_id_userId_order_unique" UNIQUE("status_id","userId","order");