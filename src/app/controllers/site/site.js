const Recipe = require('../../models/recipe')
const Chef = require('../../models/chef')

module.exports = {
    home(req, res) {
        Recipe.home(recipes => {
            return res.render("site/home", { recipes })
        })
        
    },
    about(req, res) {
        return res.render("site/about")
    },
    recipesList(req, res) {
        let { filter, page } = req.query
        const limit = 9

        page = page || 1
        let offset = (page - 1) * limit 

        const params = {
            filter, 
            page, 
            limit,
            offset,
            callback(recipes) {
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
            }
        }

        Recipe.paginate(params)

    },
    recipeDescription(req, res) {
        const id = req.params.id

        Recipe.find(id, recipe => {
            return res.render("site/description", { recipe })
        })
        
    },
    chefsList(req, res) {
        Chef.all( chefs => {
            return res.render("site/chefs", { chefs })
        })
        
    }
}