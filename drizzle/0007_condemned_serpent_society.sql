-- Custom SQL migration file, put you code below! --
INSERT INTO
    exercise (name, category_id, unit_id)
VALUES
    (
        'bayesian curl',
        (
            SELECT
                id
            FROM
                category
            WHERE
                name = 'biceps'
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