ALTER TABLE "exercise" DROP CONSTRAINT "exercise_name_category_id_unique";--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "exercise" ADD COLUMN "userId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise" ADD CONSTRAINT "exercise_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_name_category_id_userId_unique" UNIQUE("name","category_id","userId");