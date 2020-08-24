const db = require('../../config/db')

module.exports = {
    home(callback) {
        const query = `
        SELECT recipes.*, chefs.name AS chef
        FROM recipes
        JOIN chefs
        ON recipes.chef_id = chefs.id
        LIMIT 6;
        `

        db.query(query, (err, results) => {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    all(callback) {
        const query = `
        SELECT recipes.*, chefs.name AS chef
        FROM recipes
        JOIN chefs
        ON recipes.chef_id = chefs.id;
        `

        db.query(query, (err, results) => {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    chefSelectOptions(callback) {
        db.query(`SELECT id, name FROM chefs;`, (err, results) => {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    findBy(filter, callback) {
        const query = `
        SELECT recipes.*, chefs.name AS chef
        FROM recipes
        JOIN chefs
        ON recipes.chef_id = chefs.id
        WHERE recipes.title ILIKE '%${filter}%';
        `

        db.query(query, (err, results) => {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    },
    find(id, callback) {
        const query = `
        SELECT recipes.*, chefs.name AS chef
        FROM recipes
        JOIN chefs
        ON recipes.chef_id = chefs.id
        WHERE recipes.id=$1;
        `

        db.query(query, [ id ], (err, result) => {
            if (err) throw `Database error! ${err}`

            callback(result.rows[0])
        })
    },
    create(data, callback) {
        const query = `
        INSERT INTO recipes (
            chef_id,
            image,
            title,
            ingredients,
            preparation,
            information,
            created_at
        ) VALUES ( $1, $2, $3, $4, $5, $6, $7 );
        `
        
        const values = [ 
            data.chef_id, 
            data.image, 
            data.title, 
            data.filteredIngredients, 
            data.filteredPreparation, 
            data.information, 
            data.created_at,
        ]
        
        db.query(query, values, (err, results) => {
            if (err) throw `Database error! ${err}`
            
            console.log(results)
            callback()
        })
    },
    update(data, callback) {
        const query = `
        UPDATE recipes SET
            chef_id=$1,
            image=$2,
            title=$3,
            ingredients=$4,
            preparation=$5,
            information=$6
        WHERE id=$7;
        `

        const values = [
            data.chef_id,
            data.image, 
            data.title, 
            data.filteredIngredients, 
            data.filteredPreparation, 
            data.information,
            data.id
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database error! ${err}`
            
            callback()
        })
    },
    delete(id, callback) {
        const query = `
        DELETE FROM recipes 
        WHERE id=$1;
        `

        db.query(query, [ id ], (err, results) => {
            if (err) throw `Database error! ${err}`

            callback()
        })
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

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

        db.query(query, [ limit, offset ], (err, results) => {
            if (err) throw `Database error! ${err}`

            callback(results.rows)
        })
    }
}