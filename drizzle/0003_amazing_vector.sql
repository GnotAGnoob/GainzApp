-- Custom SQL migration file, put you code below! --


INSERT INTO exercise (name, category_id, unit_id)
VALUES (
    'cable single arm rear delt row',
    (SELECT id FROM category WHERE name = 'shoulders' AND "userId" IS NULL),
    (SELECT id FROM unit WHERE name = 'kg')
);