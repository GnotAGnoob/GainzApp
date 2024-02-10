-- should be in drizzle schema and maybe own table -> more complicated triggers --
CREATE MATERIALIZED VIEW category_exercise_search
as
select
category.name as category, exercise.name as name, category.id as category_id,
exercise.id as exercise_id, exercise."userId" as "exercise_userId", category."userId" as "category_userId",
unit.name as unit, unit.id as unit_id,
setweight(to_tsvector('simple', category.name), 'A') || setweight(to_tsvector('simple', coalesce(exercise.name, '')), 'B') as search_vector
from category full join exercise on category.id = exercise.category_id inner join unit on exercise.unit_id = unit.id;
CREATE INDEX category_exercise_search_index on category_exercise_search USING GIN (search_vector);

CREATE OR REPLACE FUNCTION refresh_category_exercise_search()
RETURNS TRIGGER AS
$$
BEGIN
    REFRESH MATERIALIZED VIEW category_exercise_search;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

-- Trigger for exercise table
CREATE TRIGGER refresh_category_exercise_search_trigger
AFTER INSERT OR UPDATE ON exercise
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_category_exercise_search();

-- Trigger for category table
CREATE TRIGGER refresh_category_exercise_search_trigger
AFTER INSERT OR UPDATE ON category
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_category_exercise_search();

CREATE OR REPLACE FUNCTION execute_exercise_search(query_text TEXT, user_id TEXT, search_limit INT DEFAULT NULL, show_null_exercise BOOLEAN DEFAULT FALSE)
RETURNS TABLE (
    category varchar(32),
    name varchar(32),
    category_id INT,
    exercise_id INT,
    unit varchar(32),
    unit_id INT,
    "category_userId" TEXT,
    "exercise_userId" TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    modified_query TEXT;
BEGIN
    -- Split the query into words and construct the modified query
    SELECT 
        string_agg(word || ':*', '|')
    INTO 
        modified_query
    FROM (
        SELECT unnest(string_to_array(query_text, ' ')) AS word
    ) AS words;

    -- Execute the search and return the results
    RETURN QUERY 
    SELECT 
        ce.category, 
        ce.name, 
        ce.category_id, 
        ce.exercise_id, 
        ce.unit,
        ce.unit_id,
        ce."category_userId",
        ce."exercise_userId"
    FROM 
        category_exercise_search ce
    WHERE 
        ce.search_vector @@ to_tsquery('simple', modified_query)
        AND (ce."category_userId" = user_id OR ce."category_userId" IS NULL)
        AND (ce."exercise_userId" = user_id OR ce."exercise_userId" IS NULL)
        AND (show_null_exercise OR ce.exercise_id IS NOT NULL)
    ORDER BY 
        ts_rank(ce.search_vector, to_tsquery('simple', modified_query)) DESC
    LIMIT 
        COALESCE(search_limit, 100);
END; $$;

-- TRIGGERS

CREATE OR REPLACE FUNCTION insert_workout_last_spot() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."order" IS NULL THEN
        -- Determine the new order as the maximum order + 1
        NEW."order" := COALESCE((SELECT MAX("order") FROM workout WHERE "userId" = NEW."userId" AND status_id = NEW.status_id), 0) + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_workout_last_spot_trigger
BEFORE INSERT ON workout
FOR EACH ROW
EXECUTE FUNCTION insert_workout_last_spot();


CREATE OR REPLACE FUNCTION update_workout_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the order of the moved workout
    UPDATE workout
    SET "order" = NEW."order"
    WHERE id = NEW.id;

    -- Shift other workouts' order accordingly
    UPDATE workout
    SET "order" = "order" + 1
    WHERE "order" >= NEW."order"
      AND id != NEW.id
      AND status_id = NEW.status_id
      AND "userId" = NEW."userId";

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workout_order_trigger
AFTER UPDATE OF "order" ON workout
FOR EACH ROW
WHEN (NEW."order" <> OLD."order")
EXECUTE FUNCTION update_workout_order();

CREATE OR REPLACE FUNCTION insert_superset_last_spot() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."order" IS NULL THEN
        -- Determine the new order as the maximum order + 1
        NEW."order" := COALESCE((SELECT MAX("order") FROM superset WHERE workout_id = NEW.workout_id), 0) + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_superset_last_spot_trigger
BEFORE INSERT ON superset
FOR EACH ROW
EXECUTE FUNCTION insert_superset_last_spot();


CREATE OR REPLACE FUNCTION update_superset_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the order of the moved superset
    UPDATE superset
    SET "order" = NEW."order"
    WHERE id = NEW.id;

    -- Shift other supersets' order accordingly
    UPDATE superset
    SET "order" = "order" + 1
    WHERE "order" >= NEW."order"
      AND id != NEW.id
      AND workout_id = NEW.workout_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_superset_order_trigger
AFTER UPDATE OF "order" ON superset
FOR EACH ROW
WHEN (NEW."order" <> OLD."order")
EXECUTE FUNCTION update_superset_order();

CREATE OR REPLACE FUNCTION insert_superset_exercise_last_spot() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."order" IS NULL THEN
        -- Determine the new order as the maximum order + 1
        NEW."order" := COALESCE((SELECT MAX("order") FROM "supersetExercise" WHERE superset_id = NEW.superset_id), 0) + 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_superset_exercise_last_spot_trigger
BEFORE INSERT ON "supersetExercise"
FOR EACH ROW
EXECUTE FUNCTION insert_superset_exercise_last_spot();


CREATE OR REPLACE FUNCTION update_superset_exercise_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the order of the moved supersetExercise
    UPDATE "supersetExercise"
    SET "order" = NEW."order"
    WHERE id = NEW.id;

    -- Shift other supersetExercises' order accordingly
    UPDATE "supersetExercise"
    SET "order" = "order" + 1
    WHERE "order" >= NEW."order"
      AND id != NEW.id
      AND superset_id = NEW.superset_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_superset_exercise_order_trigger
AFTER UPDATE OF "order" ON "supersetExercise"
FOR EACH ROW
WHEN (NEW."order" <> OLD."order")
EXECUTE FUNCTION update_superset_exercise_order();

CREATE OR REPLACE FUNCTION check_unique_category_global()
RETURNS TRIGGER AS
$$
BEGIN
    -- Check if the combination of name and foreign key is already present
    IF EXISTS (
        SELECT 1 FROM category
        WHERE name = NEW.name AND "userId" IS NULL
    ) THEN
        RAISE EXCEPTION 'A record with the same name already exists globally.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_unique_category_global
BEFORE INSERT OR UPDATE OF name, "userId"
ON category
FOR EACH ROW
EXECUTE FUNCTION check_unique_category_global();

CREATE OR REPLACE FUNCTION check_unique_exercise_global()
RETURNS TRIGGER AS
$$
BEGIN
    -- Check if the combination of name and foreign key is already present
    IF EXISTS (
        SELECT 1 FROM exercise
        WHERE name = NEW.name AND category_id = NEW.category_id AND "userId" IS NULL
    ) THEN
        RAISE EXCEPTION 'A record with the same name already exists globally.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_unique_exercise_global
BEFORE INSERT OR UPDATE OF name, category_id, "userId"
ON exercise
FOR EACH ROW
EXECUTE FUNCTION check_unique_exercise_global();

-- INSERTS

-- Declare variables to store IDs
DO $$DECLARE
    unit_id INT;
    category_id INT;
BEGIN
    INSERT INTO status (name)
    VALUES ('template'), ('planned'), ('done');

    INSERT INTO unit (name)
    VALUES ('kg')
    RETURNING id INTO unit_id;

    -- Categories and exercises

    INSERT INTO category (name)
    VALUES ('abdominals')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('lying leg raise', category_id, unit_id),
            ('cable crunch', category_id, unit_id),
            ('hanging crunch', category_id, unit_id),
            ('bicycle', category_id, unit_id),
            ('hanging toes to bar', category_id, unit_id),
            ('spider crawl', category_id, unit_id),
            ('side crunch', category_id, unit_id),
            ('mountain climber', category_id, unit_id),
            ('heel touches', category_id, unit_id),
            ('pallof press', category_id, unit_id),
            ('twisting hanging knee raise', category_id, unit_id),
            ('hanging knee raise', category_id, unit_id),
            ('sit up', category_id, unit_id),
            ('russian twist', category_id, unit_id),
            ('crunch', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('adductors')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('adduction machine', category_id, unit_id),
            ('band adduction', category_id, unit_id),
            ('cable abduction', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('biceps')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('seated dumbbell curl', category_id, unit_id),
            ('seated hammer curl', category_id, unit_id),
            ('barbell curl', category_id, unit_id),
            ('dumbbell curl', category_id, unit_id),
            ('hammer curl', category_id, unit_id),
            ('cross body hammer curl', category_id, unit_id),
            ('zottman curl', category_id, unit_id),
            ('cable curl', category_id, unit_id),
            ('preacher machine curl', category_id, unit_id),
            ('preacher dumbbell curl', category_id, unit_id),
            ('preacher barbell curl', category_id, unit_id),
            ('drag dumbbell curl', category_id, unit_id),
            ('drag barbell curl', category_id, unit_id),
            ('concentration curl', category_id, unit_id),
            ('spider curl', category_id, unit_id),
            ('chin up', category_id, unit_id),
            ('reverse cable curl', category_id, unit_id),
            ('reverse barbell curl', category_id, unit_id),
            ('reverse dumbbell curl', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('calves')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('standing raise', category_id, unit_id),
            ('standing machine raise', category_id, unit_id),
            ('seated dumbbell raise', category_id, unit_id),
            ('seated machine raise', category_id, unit_id),
            ('leg press raise', category_id, unit_id),
            ('barbell raise ', category_id, unit_id),
            ('smith machine raise ', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('chest')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('dumbbell bench press', category_id, unit_id),
            ('incline dumbbell bench press', category_id, unit_id),
            ('barbell bench press', category_id, unit_id),
            ('incline barbell bench press', category_id, unit_id),
            ('smith machine bench press', category_id, unit_id),
            ('smith machine incline bench press', category_id, unit_id),
            ('dumbbell pullover', category_id, unit_id),
            ('dumbbell flys', category_id, unit_id),
            ('incline dumbbell flys', category_id, unit_id),
            ('pec dec', category_id, unit_id),
            ('cable flys', category_id, unit_id),
            ('low to high cable flys', category_id, unit_id),
            ('high to low cable flys', category_id, unit_id),
            ('cable crossover', category_id, unit_id),
            ('low to high cable crossover', category_id, unit_id),
            ('high to low cable crossover', category_id, unit_id),
            ('dip', category_id, unit_id),
            ('push up', category_id, unit_id),
            ('machine press', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('forearms')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('dumbbell wrist curl', category_id, unit_id),
            ('barbell wrist curl', category_id, unit_id),
            ('behind the back barbell curl', category_id, unit_id),
            ('reverse barbell wrist curl', category_id, unit_id),
            ('reverse dumbbell wrist curl', category_id, unit_id),
            ('farmers carry', category_id, unit_id),
            ('wrist roller', category_id, unit_id),
            ('cable wrist curl', category_id, unit_id),
            ('cable reverse wrist curl', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('glutes')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('barbell hip thrust', category_id, unit_id),
            ('hip thrust', category_id, unit_id),
            ('hyperextension', category_id, unit_id),
            ('cable hip extension', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('hamstrings')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('deadlift', category_id, unit_id),
            ('lying machine curl', category_id, unit_id),
            ('lying single leg machine curl', category_id, unit_id),
            ('seated machine curl', category_id, unit_id),
            ('seated single leg machine curl', category_id, unit_id),
            ('stiff leg deadlift', category_id, unit_id),
            ('glute ham raise', category_id, unit_id),
            ('sumo deadlift', category_id, unit_id),
            ('romanian deadlift', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('lats')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('pull up', category_id, unit_id),
            ('close grip pull up', category_id, unit_id),
            ('wide grip pull up', category_id, unit_id),
            ('pull down', category_id, unit_id),
            ('close grip pull down', category_id, unit_id),
            ('wide grip pull down', category_id, unit_id),
            ('straight arm cable pull down', category_id, unit_id),
            ('close grip cable row', category_id, unit_id),
            ('single arm cable pull down', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('back')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('dumbbell row', category_id, unit_id),
            ('single arm dumbbell row', category_id, unit_id),
            ('barbell row', category_id, unit_id),
            ('machine row', category_id, unit_id),
            ('single arm cable row', category_id, unit_id),
            ('cable row', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('quadriceps')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('barbell squat', category_id, unit_id),
            ('dumbbell squat', category_id, unit_id),
            ('leg extension', category_id, unit_id),
            ('single leg extension', category_id, unit_id),
            ('leg press', category_id, unit_id),
            ('hack squat', category_id, unit_id),
            ('bulgarian split squat', category_id, unit_id),
            ('front squat', category_id, unit_id),
            ('smith machine squat', category_id, unit_id),
            ('sissy squat', category_id, unit_id),
            ('lunge', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('shoulders')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('dumbbell lateral raise', category_id, unit_id),
            ('cable lateral raise', category_id, unit_id),
            ('machine lateral raise', category_id, unit_id),
            ('overhead barbell press', category_id, unit_id),
            ('overhead dumbbell press', category_id, unit_id),
            ('smith machine press', category_id, unit_id),
            ('machine press', category_id, unit_id),
            ('dumbbell front raises', category_id, unit_id),
            ('cable front raises', category_id, unit_id),
            ('lying rear delt row', category_id, unit_id),
            ('cable rear delt row', category_id, unit_id),
            ('reverse flys', category_id, unit_id),
            ('lying reverse dumbbell flys', category_id, unit_id),
            ('machine reverse flys', category_id, unit_id),
            ('cable reverse flys', category_id, unit_id),
            ('face pull', category_id, unit_id),
            ('cable upright row', category_id, unit_id),
            ('cable external rotation', category_id, unit_id),
            ('banded external rotation', category_id, unit_id),
            ('cable internal rotation', category_id, unit_id),
            ('banded internal rotation', category_id, unit_id),
            ('upright row', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('traps')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('dumbbell shrug', category_id, unit_id),
            ('barbell shrug', category_id, unit_id),
            ('smith machine shrug', category_id, unit_id),
            ('upright row', category_id, unit_id);

    INSERT INTO category (name)
    VALUES ('triceps')
    RETURNING id INTO category_id;

    INSERT INTO exercise (name, category_id, unit_id)
    VALUES ('straight bar pushdown', category_id, unit_id),
            ('single arm cable pushdown', category_id, unit_id),
            ('rope pushdown', category_id, unit_id),
            ('seated dumbbell extension', category_id, unit_id),
            ('overhead extension', category_id, unit_id),
            ('low cable overhead extension', category_id, unit_id),
            ('kickback', category_id, unit_id),
            ('dip', category_id, unit_id),
            ('close grip bench press', category_id, unit_id),
            ('dumbbell skull crusher', category_id, unit_id),
            ('barbell skull crusher', category_id, unit_id);

END$$;
