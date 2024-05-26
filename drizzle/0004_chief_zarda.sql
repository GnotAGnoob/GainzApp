-- Custom SQL migration file, put you code below! --
UPDATE exercise
SET
    name = 'hanging leg raise'
FROM
    category c
WHERE
    exercise.category_id = c.id
    AND exercise.name = 'hanging crunch'
    AND c.name = 'abdominals'
    AND exercise."userId" IS NULL;

UPDATE exercise
SET
    name = 'lying rear delt row'
FROM
    category c
WHERE
    exercise.category_id = c.id
    AND exercise.name = 'dumbbell lying rear delt row'
    AND c.name = 'shoulders'
    AND exercise."userId" IS NULL;

INSERT INTO
    exercise (name, category_id, unit_id)
VALUES
    (
        'barbell lying rear delt row',
        (
            SELECT
                id
            FROM
                category
            WHERE
                name = 'shoulders'
                AND "userId" IS NULL
        ),
        (
            SELECT
                id
            FROM
                unit
            WHERE
                name = 'kg'
        )
    );