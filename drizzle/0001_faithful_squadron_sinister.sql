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

CREATE OR REPLACE FUNCTION execute_exercise_search(query_text TEXT, user_id TEXT, search_limit INT DEFAULT NULL)
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
    ORDER BY 
        ts_rank(ce.search_vector, to_tsquery('simple', modified_query)) DESC
    LIMIT 
        COALESCE(search_limit, 100);
END; $$;