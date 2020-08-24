const db = require('../../config/db')

module.exports = {
    all(callback) {
        const query = `
        SELECT chefs.*, COUNT(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes
        ON chefs.id = recipes.chef_id
        GROUP BY chefs.id
        ORDER BY total_recipes DESC;
        `

        db.query(query, (err, results) => {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    find(id, callback) {
        const queryCountRecipesFromChef = `(
            SELECT COUNT(*) FROM recipes
            WHERE chef_id = $1
        ) AS total_recipes`

        const query = `
        SELECT chefs.*, ${queryCountRecipesFromChef},
            recipes.id AS recipe_id,
            recipes.chef_id,
            recipes.title,
            recipes.image,
            recipes.ingredients,
            recipes.preparation,
            recipes.information
        FROM chefs
        LEFT JOIN recipes
        ON chefs.id = recipes.chef_id
        WHERE chefs.id = $1 OR recipes.chef_id = $1
        GROUP BY chefs.id, recipes.id;
        `

        db.query(query, [ id ], (err, results) => {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
        INSERT INTO chefs (
            name, 
            avatar_url,
            created_at
        ) VALUES ($1, $2, $3) RETURNING id;
        `

        const values = [
            data.name,
            data.avatar_url,
            data.created_at
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database error! ${err}`

            callback(results.rows[0])
        })   
    }, 
    update(data, callback) {
        const query = `
        UPDATE chefs 
        SET name=$1, 
            avatar_url=$2
        WHERE id=$3;
        `

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database error! ${err}`

            callback()
        })
    },
    delete(id, callback) {
        const query = `
        DELETE FROM chefs
        WHERE id=$1;
        `

        db.query(query, [ id ], (err, results) => {
            if (err) throw `Database error! ${err}`

            callback()
        })
    }
}