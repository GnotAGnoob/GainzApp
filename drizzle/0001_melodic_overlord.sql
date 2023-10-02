-- should be in drizzle schema and maybe own table -> more complicated triggers --
CREATE MATERIALIZED VIEW category_exercise_search
as
select
category.name as category, exercise.name as name, category.id as category_id,
exercise.id as exercise_id, "userId",
setweight(to_tsvector('simple', category.name), 'A') || setweight(to_tsvector('simple', coalesce(exercise.name, '')), 'B') as search_vector
from category full join exercise on category.id = exercise.category_id;
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
    userId TEXT
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
        ce."userId"
    FROM 
        category_exercise_search ce
    WHERE 
        ce.search_vector @@ to_tsquery('simple', modified_query)
        AND (ce."userId" = user_id)
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
    -- Determine the new order as the maximum order + 1
    NEW."order" := COALESCE((SELECT MAX("order") FROM workout WHERE "userId" = NEW."userId" AND status_id = NEW.status_id), 0) + 1;
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
    -- Determine the new order as the maximum order + 1
    NEW."order" := COALESCE((SELECT MAX("order") FROM superset WHERE workout_id = NEW.workout_id), 0) + 1;
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
    -- Determine the new order as the maximum order + 1
    NEW."order" := COALESCE((SELECT MAX("order") FROM "supersetExercise" WHERE superset_id = NEW.superset_id), 0) + 1;
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

-- INSERTS

INSERT INTO unit (name) VALUES ('kg');

INSERT INTO status (name) VALUES ('template'), ('planned'), ('done');