INSERT INTO
    exercise (name, category_id, unit_id)
VALUES
    (
        'side jackknife crunch',
        (
            SELECT
                id
            FROM
                category
            WHERE
                name = 'abdominals'
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
        'dragon flag',
        (
            SELECT
                id
            FROM
                category
            WHERE
                name = 'abdominals'
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
        'machine crunch',
        (
            SELECT
                id
            FROM
                category
            WHERE
                name = 'abdominals'
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
        'cable low to high twist',
        (
            SELECT
                id
            FROM
                category
            WHERE
                name = 'abdominals'
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
        'cable high to low twist',
        (
            SELECT
                id
            FROM
                category
            WHERE
                name = 'abdominals'
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
        'cable twist',
        (
            SELECT
                id
            FROM
                category
            WHERE
                name = 'abdominals'
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
        'roll out',
        (
            SELECT
                id
            FROM
                category
            WHERE
                name = 'abdominals'
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