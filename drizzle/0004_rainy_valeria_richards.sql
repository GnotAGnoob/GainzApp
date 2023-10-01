ALTER TABLE "workout" RENAME COLUMN "name" TO "note";--> statement-breakpoint
ALTER TABLE "workout" DROP CONSTRAINT "workout_order_userId_unique";--> statement-breakpoint
ALTER TABLE "workout" ADD CONSTRAINT "workout_order_userId_status_id_unique" UNIQUE("order","userId","status_id");