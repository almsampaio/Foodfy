const Recipe = require('../../models/Recipe')
const File = require('../../models/File')
const Chef = require('../../models/Chef')

module.exports = {
    async home(req, res) {
        let results = await Recipe.home()
        const recipes = results.rows

        results = recipes.map(recipe => Recipe.findRecipeFiles(recipe.id))
        const recipesFiles = await Promise.all(results)
        recipesFiles.map((result, index) => {
            recipes[index].image = `${req.protocol}://${req.headers.host}${result.rows[0].path.replace("public", "")}`
        })
        
        return res.render("site/home", { recipes })
    },
    about(req, res) {
        return res.render("site/about")
    },
    async recipesList(req, res) {
        let { filter, page } = req.query
        const limit = 9

        page = page || 1
        let offset = (page - 1) * limit 

        const params = {
            filter, 
            page, 
            limit,
            offset
        }

        let results = await Recipe.paginate(params)
        const recipes = results.rows

        results = recipes.map(recipe => Recipe.findRecipeFiles(recipe.id))
        const recipesFiles = await Promise.all(results)
        recipesFiles.map((result, index) => {
            recipes[index].image = `${req.protocol}://${req.headers.host}${result.rows[0].path.replace("public", "")}`
        })

        let total
        
        if (recipes[0]) {
            total = Math.ceil(recipes[0].total / limit)
        } else {
            total = 0
        }

        const pagination = {
            total,
            page
        }

        return res.render("site/recipes", { recipes, filter,  pagination })
    },
    async recipeDescription(req, res) {
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
        
        return res.render("site/description", { recipe, files })
    },
    async chefsList(req, res) {
        let results = await Chef.all()
        const chefs = results.rows

        const filesPromise = chefs.map(chef => File.find(chef.file_id))
        const filesArray = await Promise.all(filesPromise)

        for (let index = 0; index < chefs.length; index += 1) {
            chefs[index].file_name = filesArray[index].rows[0].name
            chefs[index].src = `${req.protocol}://${req.headers.host}${filesArray[index].rows[0].path.replace("public", "")}`
        }
        
        return res.render("site/chefs", { chefs })
    }
}