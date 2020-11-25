const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({filename, path}) {
        const query = `
        INSERT INTO files (
            name,
            path
        ) VALUES ($1, $2) RETURNING id;
        `
        const values = [
            filename,
            path
        ]

        return db.query(query, values)
    },
    recipeFileRelation({recipeId, fileId}) {
        const query = `
        INSERT INTO recipe_files (
            recipe_id,
            file_id
        ) VALUES ($1, $2);
        `
        return db.query(query, [ recipeId, fileId ])
    },
    find(id) {
        return db.query('SELECT * FROM files WHERE id = $1', [ id ])
    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [ id ])
            const file = result.rows[0]
    
            fs.unlinkSync(file.path)
    
            return db.query(`
            DELETE FROM files
            WHERE id = $1;
            `, [ id ])

        } catch (err) {
            throw `Database error! ${err}`
        }
    },
    deleteRelation(fileId) {
        const query = `
        DELETE FROM recipe_files
        WHERE file_id = $1;
        `

        return db.query(query, [ fileId ])
    }
}