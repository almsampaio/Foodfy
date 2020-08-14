const express = require('express')
const routes = express.Router() 
const recipesController = require('./app/controllers/recipes')
const chefsController = require('./app/controllers/chefs')

const data = require('../data.json')
const recipes = data.recipes

routes.get("/", function(req, res) {
    const items = recipes.slice(0, 6)

    return res.render("client/home", { items })
})
routes.get("/about", function(req, res) {
    return res.render("client/about")
})
routes.get("/recipes", function(req, res) {
    return res.render("client/recipes", { recipes })
})
routes.get("/recipes/:index", function(req, res) {
    return res.render("client/description", { recipe: recipes[req.params.index] })
})

// RECIPES
routes.get("/admin/recipes", recipesController.index)
routes.get("/admin/recipes/create", recipesController.create)
routes.get("/admin/recipes/:id", recipesController.show)
routes.get("/admin/recipes/:id/edit", recipesController.edit)

routes.post("/admin/recipes", recipesController.post) 
routes.put("/admin/recipes", recipesController.put) 
routes.delete("/admin/recipes", recipesController.delete) 

// CHEFS
routes.get("/admin/chefs", chefsController.index)
routes.get("/admin/chefs/create", chefsController.create)
routes.get("/admin/chefs/:id", chefsController.show) 
routes.get("/admin/chefs/:id/edit", chefsController.edit)

routes.post("/admin/chefs", chefsController.post)
routes.put("/admin/chefs", chefsController.put)
routes.delete("/admin/chefs", chefsController.delete) 


module.exports = routes