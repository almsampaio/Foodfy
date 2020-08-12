const fs = require('fs')
const data = require('../../../data.json')

module.exports = {
    index(req, res) {
        return res.render("admin/recipes/index", { recipes: data.recipes })
    },
    create(req, res) {
        return res.render("admin/recipes/create")
    },
    show(req, res) {
        const id = req.params.id
        const foundRecipe = data.recipes.find(function(recipe) {
            return recipe.id == id
        })

        if (!foundRecipe) return res.send("Recipe not found!")

        return res.render("admin/recipes/show", { recipe: foundRecipe })
    },
    edit(req, res) {
        const id = req.params.id
        const foundRecipe = data.recipes.find(function(recipe) {
            return recipe.id == id
        })
    
        if (!foundRecipe) return res.send("Recipe not found!")
    
        return res.render("admin/recipes/edit", { recipe: foundRecipe })
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "")
                return res.send("Please, fill all the fields!")
        }
    
        const { author, title, image, ingredients, preparation, information } = req.body
     
        let id = 1
        if (data.recipes.length != 0) 
            id = data.recipes[data.recipes.length - 1].id + 1

        const filteredIngredients = ingredients.filter(ingredient => ingredient != "" )
        const filteredPreparation = req.body.preparation.filter(step => step != "" )
        
        data.recipes.push({
            id,
            author, 
            title, 
            image,
            ingredients: filteredIngredients, 
            preparation: filteredPreparation, 
            information
        }) 
        
        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
            if (err) return res.send("Write file error!")
    
            return res.redirect("recipes")
        })
    },
    put(req, res) {
        const id = req.body.id
        let index = 0
        const foundRecipe = data.recipes.find(function(recipe, recipeIndex) {
            if ( recipe.id == id ) {
                index = recipeIndex
                return true
            }
        })
    
        if ( !foundRecipe ) return res.send("Recipe not found!")
    
        const filteredIngredients = req.body.ingredients.filter(ingredient => ingredient != "" )
        const filteredPreparation = req.body.preparation.filter(step => step != "" )

        const recipe = {
            ...foundRecipe,
            ...req.body,
            ingredients: filteredIngredients,
            preparation: filteredPreparation,
            id: Number(req.body.id)
        }
    
        data.recipes[index] = recipe
    
        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
            if (err) return res.send("Write error!")
    
            return res.redirect(`/admin/recipes/${ id }`)
        })
    },
    delete(req, res) {
        const id = req.body.id
        const filteredRecipes = data.recipes.filter(function(recipe) {
            return recipe.id != id
        })
    
        data.recipes = filteredRecipes
    
        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
            if (err) return res.send("Write error!")
    
            res.redirect('/admin/recipes')
        })
    }
}