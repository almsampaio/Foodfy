const { date } = require ('../../lib/utils')
const Chef = require('../../models/Chef')
const File = require('../../models/File')
const Recipe = require('../../models/Recipe')

module.exports = {
    async index(req, res) {
        let results = await Chef.all()
        const chefs = results.rows

        const filesPromise = chefs.map(chef => File.find(chef.file_id))
        const filesArray = await Promise.all(filesPromise)

        for (let index = 0; index < chefs.length; index += 1) {
            chefs[index].file_name = filesArray[index].rows[0].name
            chefs[index].src = `${req.protocol}://${req.headers.host}${filesArray[index].rows[0].path.replace("public", "")}`
        }

        return res.render('admin/chefs/index', { chefs })
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    async show(req, res) {
        const id = req.params.id

        let results = await Chef.find(id)
        const chef = results.rows[0]

        results = await File.find(chef.file_id)
        const file = {
            ...results.rows[0],
            src: `${req.protocol}://${req.headers.host}${results.rows[0].path.replace("public", "")}`
        }

        results = await Recipe.findByChef(id)
        const recipesWithoutFiles = results.rows
        
        const recipeFilesPromises = recipesWithoutFiles.map(recipe => Recipe.findRecipeFiles(recipe.id))
        results = await Promise.all(recipeFilesPromises) // results = [{result}, {result}]
        
        let recipes = []

        for (let index = 0; index < recipesWithoutFiles.length; index += 1) {
            recipes.push({
                ...recipesWithoutFiles[index],
                src: `${req.protocol}://${req.headers.host}${results[index].rows[0].path.replace("public", "")}`
            })
        }

        return res.render('admin/chefs/show', { chef, file, recipes })
    },
    async edit(req, res) {
        const id = req.params.id

        const results = await Chef.find(id)
        const chef = results.rows[0]
        
        return res.render('admin/chefs/edit', { chef })
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] === "")
                return res.send("Please, fill all the fields.")
        }

        if (!req.file)  
            return res.send("Please, send one avatar image!") 

        try {
            let results = await File.create(req.file)
            const fileId = results.rows[0].id

            const { name } = req.body
            const createdAt = date(Date.now()).iso

            const data = {
                name, 
                createdAt,
                fileId
            }

            results = await Chef.create(data)
            const chefId = results.rows[0].id

            return res.redirect(`/admin/chefs/${chefId}`)
        } catch (err) {
            throw `Error! ${err}`
        }
        
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] === "")
                return res.send("Please, fill all the fields.")
        }

        const { id, name, file_id } = req.body

        let data = {}

        if (req.file) {
            try {
                let results = await File.create(req.file)
                const newFileId = results.rows[0] // { id: value }
    
                data = {
                    name, 
                    file_id: newFileId['id'],
                    id
                }
            } catch (err) {
                throw `Error! Could not update chef. ${err}`
            }
        } else {
            data = {
                name,
                file_id,
                id
            }
        }

        await Chef.update(data)

        if (file_id !== data.file_id) {
            await File.delete(file_id)
        } // the file can not be deleted before the chef because of the foreign key chefs.file_id

        return res.redirect(`/admin/chefs/${id}`)
    },
    async delete(req, res) {
        const id = req.body.id

        try {
            const results = await Chef.find(id)
            const fileId = results.rows[0].file_id
            
            await File.delete(fileId)

            await Chef.delete(id)
        } catch (err) {
            throw `Could not delete chef! ${err}`
        }

        return res.redirect('/admin/chefs')
    }
}