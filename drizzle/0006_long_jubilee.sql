-- Custom SQL migration file, put you code below! --
INSERT INTO
    exercise (name, category_id, unit_id)
VALUES
    (
        'extension',
        (
            SELECT
                id
            FROM
                category
            WHERE
                name = 'back'
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