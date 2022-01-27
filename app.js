let express = require('express');
let app = express();
let mongoose = require('mongoose');
let passport = require('passport');
let BodyParser = require('body-parser');
let LocalStrategy = require('passport-local');
let plm = require('passport-local-mongoose');
let User = require('./models/user');

mongoose.connect("mongodb://localhost:27017/authenticationPrac");
app.use(BodyParser.urlencoded({ extended: true}));


app.use(require('express-session')({
    secret: 'Learning is a never ending process',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//                      ========================================================
//                                               Routes
//                      ========================================================

app.get('/', function(req, res){
    res.render("home.ejs");
});

app.get("/authentication",isLoggedIn, function(req, res){
    res,res.render("auth.ejs");
});

//Authentication routes
//register form page

app.get("/register", function(req, res){
    res.render("register.ejs");
});

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register.ejs");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/authentication");
            })
        }
    });
});

// Login form page
app.get("/login", function(req, res){
    res.render("login.ejs");
});
//middleware
app.post("/login",passport.authenticate("local",{
    successRedirect: "/authentication",
    failureRedirect: "/login"
}), function(req, res){

});


//Logout
app.get("/logout",function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(5555,function(){
    console.log("Server Started");
});