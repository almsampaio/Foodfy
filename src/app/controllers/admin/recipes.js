const { date } = require('../../lib/utils')
const Recipe = require('../../models/Recipe')
const File = require('../../models/File')
const Chef = require('../../models/Chef')

module.exports = {
    async index(req, res) {
        let results = await Recipe.all()
        const recipes = results.rows

        results = recipes.map(recipe => Recipe.findRecipeFiles(recipe.id))
        const recipesFiles = await Promise.all(results)
        recipesFiles.map((result, index) => {
            recipes[index].image = `${req.protocol}://${req.headers.host}${result.rows[0].path.replace("public", "")}`
        })
        
        return res.render("admin/recipes/index", { recipes })
    },
    async create(req, res) {
        const results = await Chef.all()
        const chefs = results.rows
        
        return res.render("admin/recipes/create", { chefs })
    },
    async show(req, res) {
        const id = req.params.id

        let results = await Recipe.find(id)
        const recipe = results.rows[0]

        results = await Recipe.findRecipeFiles(id)
        let files = []
        results.rows.map(file => {
            files.push({
                ...file, 
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            })
        })

        return res.render('admin/recipes/show', { recipe, files })
    },
    async edit(req, res) {
        const id = req.params.id

        let results = await Chef.all()
        const chefs = results.rows
        
        results = await Recipe.find(id)
        const recipe = results.rows[0]

        results = await Recipe.findRecipeFiles(recipe.id)
        const files = []
        results.rows.map(file => {
            files.push({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            })
        })

        return res.render("admin/recipes/edit", { recipe, chefs, files })
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "")
                return res.send("Please, fill all the fields!")
        }
    
        const { chef_id, title, ingredients, preparation, information } = req.body
        
        const filteredIngredients = ingredients.filter(ingredient => ingredient != "" )
        const filteredPreparation = preparation.filter(step => step != "" )
        
        const created_at = date(Date.now()).iso
        
        const data = { 
            chef_id, 
            title, 
            filteredIngredients, 
            filteredPreparation, 
            information, 
            created_at,
        }
        
        let results = await Recipe.create(data)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({ ...file }))
        const filesIdArray = await Promise.all(filesPromise)

        const recipeFilesPromise = filesIdArray.map(file => File.recipeFileRelation( {recipeId, fileId: file.rows[0]['id']} ))
        await Promise.all(recipeFilesPromise)

        return res.redirect('/admin/recipes')
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] === "" && key !== "removed_files") {
                return res.send('Please, fill all the fields!')
            }
        }

        if (req.files.length !== 0) {
            const newFilesPromise = req.files.map(file =>
                File.create({ ...file }))

            let results = await Promise.all(newFilesPromise)
            const recipeFilesRelationsPromises = results.map(result => {
                File.recipeFileRelation({
                    recipeId: Number(req.body.id),
                    fileId: Number(result.rows[0].id),
                })
            })

            await Promise.all(recipeFilesRelationsPromises)
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",") // [1,2,3, ]
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1) // [1,2,3]

            const removedFilesRelationPromise = removedFiles.map(id => File.deleteRelation(id))
            await Promise.all(removedFilesRelationPromise)
            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        }

        const { id, chef_id, title, ingredients, preparation, information } = req.body

        const filteredIngredients = ingredients.filter(ingredient => ingredient != "" )
        const filteredPreparation = preparation.filter(step => step != "" )

        const data = {
            id: Number(id),
            chef_id: Number(chef_id),
            title, 
            filteredIngredients, 
            filteredPreparation, 
            information
        }

        await Recipe.update(data)
            
        return res.redirect(`/admin/recipes/${ id }`)

    },
    async delete(req, res) {
        const recipeId = req.body.id

        try {
            let results = await File.findAll(recipeId)
            const filesPromise = results.rows.map(file => File.delete(file.id))
            await Promise.all(filesPromise)
            
            await Recipe.delete(recipeId)

            return res.redirect('/admin/recipes')
        } catch (err) {
            throw `Database error! ${err}`
        }
    }
}