// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/restaurants");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/restaurants");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/restaurants", isAuthenticated, (req, res) => {
    res.render("index");
    // $("#searchNavLi").attr("class", "nav-item active");
    // $("#favoritesNavLi").attr("class", "nav-item");
    // $("#reviewedNavLi").attr("class", "nav-item");
  });

  app.get("/restaurantsearch", isAuthenticated, (req, res) => {
    res.render("restaurantsearch", {
      restaurants: restaurantArray
    });
  });

  app.get("/favorites", isAuthenticated, (req, res) => {
    res.render("favorites");
    // $("#favoritesNavLi").attr("class", "nav-item active");
    // $("#searchNavLi").attr("class", "nav-item");
    // $("#reviewedNavLi").attr("class", "nav-item");
  });

  app.get("/reviewed", isAuthenticated, (req, res) => {
    res.render("reviewed");
    // $("#reviewedNavLi").attr("class", "nav-item active");
    // $("#favoritesNavLi").attr("class", "nav-item");
    // $("#searchNavLi").attr("class", "nav-item");
  });
};
