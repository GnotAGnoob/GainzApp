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