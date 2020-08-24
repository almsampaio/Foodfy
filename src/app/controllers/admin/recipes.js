const { date } = require('../../lib/utils')
const Recipe = require('../../models/recipe')

module.exports = {
    index(req, res) {
        Recipe.all(recipes => {
            return res.render("admin/recipes/index", { recipes })
        })
        
    },
    create(req, res) {
        Recipe.chefSelectOptions(chefs => {
            return res.render("admin/recipes/create", { chefs })
        })

    },
    show(req, res) {
        const id = req.params.id

        Recipe.find(id, recipe => {
            return res.render('admin/recipes/show', { recipe })
        })

    },
    edit(req, res) {
        const id = req.params.id
        let chefList = []

        Recipe.chefSelectOptions(chefs => {
            chefList = chefs
        })
        
        Recipe.find(id, recipe => {
            return res.render("admin/recipes/edit", { recipe, chefs: chefList })
        })

    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "")
                return res.send("Please, fill all the fields!")
        }
    
        const { chef_id, title, image, ingredients, preparation, information } = req.body
        
        const filteredIngredients = ingredients.filter(ingredient => ingredient != "" )
        const filteredPreparation = preparation.filter(step => step != "" )
        
        const created_at = date(Date.now()).iso
        
        const data = { 
            chef_id, 
            image, 
            title, 
            filteredIngredients, 
            filteredPreparation, 
            information, 
            created_at,
        }
        
        Recipe.create(data, () => {
            return res.redirect('/admin/recipes')
        })
        
    },
    put(req, res) {
        const { id, chef_id, image, title, ingredients, preparation, information } = req.body

        const filteredIngredients = ingredients.filter(ingredient => ingredient != "" )
        const filteredPreparation = preparation.filter(step => step != "" )

        const data = {
            id: Number(id),
            chef_id: Number(chef_id),
            image, 
            title, 
            filteredIngredients, 
            filteredPreparation, 
            information
        }

        Recipe.update(data, () => {
            return res.redirect(`/admin/recipes/${ id }`)
        })

    },
    delete(req, res) {
        const id = req.body.id
        
        Recipe.delete(id, () => {
            return res.redirect('/admin/recipes')
        })
    }
}