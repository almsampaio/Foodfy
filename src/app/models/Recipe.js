const db = require('../../config/db')

module.exports = {
    home() {
        const query = `
        SELECT recipes.*, chefs.name AS chef
        FROM recipes
        JOIN chefs
        ON recipes.chef_id = chefs.id
        LIMIT 6;
        `

        return db.query(query)
    },
    all() {
        const query = `
        SELECT recipes.*, chefs.name AS chef
        FROM recipes
        JOIN chefs
        ON recipes.chef_id = chefs.id;
        `

        return db.query(query)
    },
    findByChef(chef_id) {
        const query = `
            SELECT * FROM recipes
            WHERE chef_id = $1;
        `

        return db.query(query, [ chef_id ])
    },
    find(id) {
        const query = `
        SELECT recipes.*, chefs.name AS chef
        FROM recipes
        JOIN chefs
        ON recipes.chef_id = chefs.id
        WHERE recipes.id=$1;
        `
        
        return db.query(query, [ id ])
    },
    findRecipeFiles(recipe_id) {
        const query = `
        SELECT files.*
        FROM files
        JOIN recipe_files
        ON files.id = recipe_files.file_id
        WHERE recipe_files.recipe_id = $1;
        `

        return db.query(query, [ recipe_id ])
    },
    create(data) {
        const query = `
        INSERT INTO recipes (
            chef_id,
            title,
            ingredients,
            preparation,
            information,
            created_at
        ) VALUES ( $1, $2, $3, $4, $5, $6 )
        RETURNING id;
        `
        
        const values = [ 
            data.chef_id, 
            data.title, 
            data.filteredIngredients, 
            data.filteredPreparation, 
            data.information, 
            data.created_at,
        ]
        
        return db.query(query, values)
    },
    update(data) {
        const query = `
        UPDATE recipes SET
            chef_id=$1,
            title=$2,
            ingredients=$3,
            preparation=$4,
            information=$5
        WHERE id=$6;
        `

        const values = [
            data.chef_id,
            data.title, 
            data.filteredIngredients, 
            data.filteredPreparation, 
            data.information,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        const query = `
        DELETE FROM recipes 
        WHERE id=$1;
        `

        return db.query(query, [ id ])
    },
    paginate(params) {
        const { filter, limit, offset } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT COUNT(*) FROM recipes
            ) AS total`

        if (filter) {
            filterQuery = `
            WHERE recipes.title ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT COUNT(*) FROM recipes
                ${filterQuery}
            ) AS total`
        }

        query = `
            SELECT recipes.*, ${totalQuery}, chefs.name AS chef
            FROM recipes
            JOIN chefs ON chefs.id = recipes.chef_id
            ${filterQuery}
            GROUP BY recipes.id, chefs.id
            LIMIT $1 OFFSET $2;  
        `

        return db.query(query, [ limit, offset ])
    }
}