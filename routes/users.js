var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/task");

var studentSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  githublink: String,
  website: String,
  location: Array,
  profilepic: {
    type: String,
    default: "default.jpeg",
  },
  feildofinterest: Array,
  job: Array,
  techstack: Array,
});

studentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Student", studentSchema);
