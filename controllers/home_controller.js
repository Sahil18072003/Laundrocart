const fs = require("fs");
const { request } = require("express");
const User = require("../models/user");
const Image = require("../models/cart");

module.exports.home = function (req, res) {
  return res.render("home", {
    title: "LaundroKart.Com",
  });
};

module.exports.offers = function (req, res) {
  return res.render("offer", {
    title: "Offers",
  });
};

module.exports.profile = function (req, res) {
  return res.render("profile", {
    title: "Profile",
  });
};

module.exports.store_locator = function (req, res) {
  return res.render("store_locator", {
    title: "Store_locator",
  });
};

module.exports.team = function (req, res) {
  return res.render("team", {
    title: "Team",
  });
};

//after clicking on schedule a wash
module.exports.ScheduleWash = function (req, res) {
  if (req.cookies.user_id) {
    return res.render("profile", {
      title: "Profile",
      name: req.cookies.name,
      user_id: req.cookies.user_id,
    });
  } else {
    return res.render("login", {
      title: "Login",
    });
  }
};

module.exports.login = function (req, res) {
  return res.render("login", {
    title: "Login",
  });
};

module.exports.franchisee = function (req, res) {
  return res.render("franchisee", {
    title: "Franchisee",
  });
};

//check user credentials, login and then make cookies for user
module.exports.entry = function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in signing up");
      return;
    }
    if (user) {
      if (user.password === password) {
        //setting the cookie
        res.cookie("user_id", user.id);
        res.cookie("name", user.name);
        res.cookie("email", user.email);
        res.render("profile", {
          title: "Profile",
          name: user.name,
          user_id: user._id,
        });
      } else {
        return res.redirect("back");
      }
    } else {
      return res.redirect("back");
    }
  });
};

module.exports.register = function (req, res) {
  return res.render("register", {
    title: "Register",
  });
};

//user is created in database
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  //finding that email exists or not
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding users email");
      return;
    }
    if (user) {
      console.log("Email is Already present");
      return res.redirect("back");
    } else {
      //if user's email is not present then register him/her
      User.create(
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          address: req.body.address,
          phone: req.body.phone,
        },
        function (err, newMember) {
          res.cookie("user_id", newMember._id);
          res.cookie("name", newMember.name);
          res.cookie("email", newMember.email);

          if (err) {
            console.log("Error in creating User " + err);
            return;
          }
          console.log(newMember);
          return res.render("profile", {
            title: "Profile",
            name: req.body.name,
            user_id: newMember._id,
          });
        }
      );
    }
  });
};

module.exports.getInTouch = function (req, res) {
  var details = JSON.stringify(req.body);
  // console.log(details);
  details += "\n";

  fs.appendFile("mynewfile1.txt", details, function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
  return res.render("franchisee", {
    title: "Franchisee",
  });
};
