const express = require('express')
const routes = express.Router() 
const admin = require('./app/controllers/recipes')

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

routes.get("/admin/recipes", admin.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", admin.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", admin.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", admin.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", admin.post); // Cadastrar nova receita
routes.put("/admin/recipes", admin.put); // Editar uma receita
routes.delete("/admin/recipes", admin.delete); // Deletar uma receita

module.exports = routes