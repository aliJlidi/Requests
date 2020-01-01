require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var cipher = require('cipher');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

try{
mongoose.connect(process.env.MLAB_URI,{useNewUrlParser: true});
  console.log("DB Connected Successfully");
  }
catch(e){
  console.log(e);
}
//create a collection schema
const userSchema = mongoose.Schema({
  username:{ type: String, required: true },
  userId: String
});
//sipher the username to get the Id

const exerciceSchema = mongoose.Schema({
  userId: { type: String, required: true  },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String
});
// create a model from the schema
const userColModel = mongoose.model("user", userSchema);
const exerciceColModel = mongoose.model("exercice", exerciceSchema);


app.use(bodyParser.json());


app.post("/api/exercise/new-user", (req, res) => {
  var username = req.body.username;
  console.log(username);
  userColModel.findOne({username:username},function(err, usersfound){
    if(!err){
    if (!usersfound) {
      const user1 = new userColModel({
        username: username,
        userId: cipher.encrypt(username)
      });
      user1.save((err)=> {
        if(!err){
          res.send("test done");//{username:username,userId:cipher.encrypt(username)}
        }
      });
    } else {
      console.log("Name exists already");
      res.send({username:"User name exists"});
    }
      }else{
        res.send(err);
      }
  });
  res.send("find function not working");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// // Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
