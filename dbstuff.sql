CREATE TABLE exercise_search (
    id SERIAL PRIMARY KEY,
    category_id INT,
    exercise_id INT,
    combined_text tsvector,
    FOREIGN KEY (category_id) REFERENCES category (id),
    FOREIGN KEY (exercise_id) REFERENCES exercise (id)
);

CREATE OR REPLACE FUNCTION populate_exercise_search()
RETURNS VOID AS $$
BEGIN
    DELETE FROM exercise_search;

    
END;
$$ LANGUAGE plpgsql;

SELECT populate_exercise_search();

CREATE MATERIALIZED VIEW category_exercise_search
as
select
category.name as category, exercise.name as name, category.id as categoryId,
exercise.id as exerciseId, "userId",
setweight(to_tsvector('simple', category.name), 'A') || setweight(to_tsvector('simple', coalesce(exercise.name, '')), 'B') as search_vector
from category full join exercise on category.id = exercise.category_id;

-- select * from category_exercise_search where to_tsvector(name) @@ to_tsquery('cur:*');

-- select * from category_exercise_search where to_tsvector(category || ' - ' || name) @@ to_tsquery('bic:*');

-- select * from category_exercise_search where to_tsvector(category || ' - ' || name) @@ to_tsquery('bic:*');

-- explain analyze select * from category_exercise_search where to_tsvector(category || ' - ' || name) @@ to_tsquery('bic:*');

CREATE INDEX category_exercise_search_index on category_exercise_search USING GIN (search_vector);

select * from category_exercise_search where search_vector @@ to_tsquery('simple', 'biceps:* | h:*')
order by ts_rank(search_vector, to_tsquery('simple', 'c:* & h:*')) desc;

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
    categoryId INT,
    exerciseId INT,
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
        ce.categoryId, 
        ce.exerciseId, 
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