-- Custom SQL migration file, put you code below! --
INSERT INTO
    exercise (name, category_id, unit_id)
VALUES
    (
        'lying rear delt fly',
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
    ),
    (
        'cable rear delt fly',
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
    ),
    (
        'barbell lying rear delt fly',
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