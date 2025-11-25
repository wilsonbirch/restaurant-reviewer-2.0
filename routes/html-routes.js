// Requiring path to so we can use relative routes to our HTML files
const path = require('path')

// Requiring Model so we can get the favorites, reviewed data etc
const db = require('../models')

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require('../config/middleware/isAuthenticated')

module.exports = function(app) {
    app.get('/', (req, res) => {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect('/restaurants')
        }
        res.sendFile(path.join(__dirname, '../public/signup.html'))
    })

    app.get('/login', (req, res) => {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect('/restaurants')
        }
        res.sendFile(path.join(__dirname, '../public/login.html'))
    })

    // Here we've add our isAuthenticated middleware to this route.
    // If a user who is not logged in tries to access this route they will be redirected to the signup page
    app.get('/restaurants', isAuthenticated, (req, res) => {
        res.render('index')
        // $("#searchNavLi").attr("class", "nav-item active");
        // $("#favoritesNavLi").attr("class", "nav-item");
        // $("#reviewedNavLi").attr("class", "nav-item");
    })

    app.get('/favorites', isAuthenticated, (req, res) => {
        db.restaurant
            .findAll({
                where: {
                    Userid: req.user.id,
                    favorite: 1,
                },
            })
            .then(data => {
                res.render('favorites', { data })
            })
            .catch(() => {
                // res.render("favorites");
            })
        // $("#favoritesNavLi").attr("class", "nav-item active");
        // $("#searchNavLi").attr("class", "nav-item");
        // $("#reviewedNavLi").attr("class", "nav-item");
    })

    app.get('/reviewed', isAuthenticated, (req, res) => {
        db.restaurant
            .findAll({
                where: {
                    Userid: req.user.id,
                    review: {
                        [db.Sequelize.Op.ne]: null,
                    },
                },
            })
            .then(data => {
                res.render('reviewed', { data })
                // eslint-disable-next-line no-unused-vars
            })
            // eslint-disable-next-line no-unused-vars
            .catch(err => {
                res.render('favorites', { data: ['error Occured'] })
            })
        // $("#reviewedNavLi").attr("class", "nav-item active");
        // $("#favoritesNavLi").attr("class", "nav-item");
        // $("#searchNavLi").attr("class", "nav-item");
    })
}
