var express = require("express");
var router = express.Router();
var studentModel = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");
const multer = require("multer");
const path = require("path");

passport.use(new localStrategy(studentModel.authenticate()));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    var dn = new Date();
    var now = dn.getTime();
    const uniqueSuffix =
      now + Math.floor(Math.random() * 1000) + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/upload",
  isLoggedIn,
  upload.single("profilepic"),
  function (req, res) {
    studentModel
      .findOne({ username: req.session.passport.user })
      .then(function (loggedin) {
        loggedin.profilepic = req.file.filename;
        loggedin.save();
      })
      .then(function () {
        res.redirect("back");
        console.log(req.file);
      });
  }
);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});
router.post("/register", function (req, res) {
  var studentdets = new studentModel({
    username: req.body.username,
    email: req.body.email,
    githublink: req.body.githublink,
    website: req.body.website,
    location: req.body.location,
    profilepic: req.body.profilepic,
    fieldofinterest: req.body.fieldofinterest,
    job: req.body.job,
    techstack: req.body.techstack,
  });
  studentModel.register(studentdets, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});
router.get("/login", function (req, res, next) {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
  }),
  function (req, res) {
    res.redirect("/profile");
  }
);

router.get("/logout", function (req, res) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}
router.get("/profile", isLoggedIn, function (req, res) {
  studentModel
    .findOne({ username: req.session.passport.user })
    .then(function (founduser) {
      res.render("profile", { user: founduser });
    });
});
router.get("/feed", function (req, res) {
  studentModel.find().then(function (allusers) {
    res.render("feed", { allusers });
  });
});

module.exports = router;
