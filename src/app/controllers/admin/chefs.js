const { date } = require ('../../lib/utils')
const Chef = require('../../models/chef')

module.exports = {
    index(req, res) {
        Chef.all(chefs => {
            return res.render('admin/chefs/index', { chefs })
        })

    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    show(req, res) {
        const id = req.params.id

        Chef.find(id, chef => {
            return res.render('admin/chefs/show', { chef })
            })

    },
    edit(req, res) {
        const id = req.params.id

        Chef.find(id, chef => {
            return res.render('admin/chefs/edit', { chef })
        })

    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] === "")
                return res.send("Please, fill all the fields.")
        }

        const { name, avatar_url } = req.body
        const created_at = date(Date.now()).iso

        const data = {
            name, 
            avatar_url, 
            created_at 
        }

        Chef.create(data, chef => {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })

    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] === "")
                return res.send("Please, fill all the fields.")
        }

        const { id, name, avatar_url } = req.body

        const data = [
            name,
            avatar_url,
            id
        ]

        Chef.update(data, () => {
            return res.redirect('/admin/chefs')
        })
    },
    delete(req, res) {
        const id = req.body.id

        Chef.delete(id, () => {
            return res.redirect('/admin/chefs')
        })
    }
}