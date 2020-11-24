const db = require('../../config/db')

module.exports = {
    all() {
        const query = `
        SELECT chefs.*, COUNT(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes
        ON chefs.id = recipes.chef_id
        GROUP BY chefs.id
        ORDER BY total_recipes DESC;
        `

        return db.query(query)
    },
    find(id) {
        const queryCountRecipes = `(
            SELECT COUNT(*) FROM recipes
            WHERE chef_id = $1
        ) AS total_recipes`

        const query = `
        SELECT 
            chefs.*,
            ${queryCountRecipes}
        FROM chefs
        LEFT JOIN recipes
        ON chefs.id = recipes.chef_id
        WHERE chefs.id = $1
        GROUP BY chefs.id, recipes.id;
        `

        return db.query(query, [ id ])
    },
    create(data) {
        const query = `
        INSERT INTO chefs (
            name,
            created_at,
            file_id
        ) VALUES ($1, $2, $3) RETURNING id;
        `

        const values = [
            data.name,
            data.createdAt,
            data.fileId,
        ]

        return db.query(query, values)   
    }, 
    update({ name, file_id, id }) {
        const query = `
        UPDATE chefs 
        SET name=$1, 
            file_id=$2
        WHERE id=$3;
        `

        const values = [
            name,
            file_id,
            id
        ]

        return db.query(query, values)
    },
    delete(id) {
        const query = `
        DELETE FROM chefs
        WHERE id=$1;
        `

        return db.query(query, [ id ])
    }
}