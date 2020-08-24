const express = require('express')
const routes = express.Router() 
const recipesController = require('./app/controllers/admin/recipes')
const chefsController = require('./app/controllers/admin/chefs')
const siteController = require('./app/controllers/site/site')


/*=== SITE ===*/

routes.get("/", siteController.home)
routes.get("/about", siteController.about)
routes.get("/recipes", siteController.recipesList)
routes.get("/recipes/:id", siteController.recipeDescription)
routes.get("/chefs", siteController.chefsList)

/*=== ADMIN ===*/

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