require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.MY_SECRET);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

try {
  mongoose.connect(process.env.MLAB_URI, { useNewUrlParser: true });
  console.log("DB Connected Successfully");
} catch (e) {
  console.log(e);
}
//create a collection schema
const userSchema = new mongoose.Schema({
  username: String, 
  userId: String
});
//sipher the username to get the Id

const exerciceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String
});
// create a model from the schema
const userModel = mongoose.model("user", userSchema);
const exerciceColModel = mongoose.model("exercice", exerciceSchema);

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.post("/api/exercise/new-user", (req, res) => {
  var userInput = req.body.username;
  var userId = cryptr.encrypt(userInput);
  var userIdSet = userId.subString(0,6);
  userModel.findOne({ username: userInput },(err, usersfound)=> {
    if (!err) {
      if (!usersfound) {
        
        const user1 = new userModel({
          username: userInput,
          userId: userIdSet
        });
        
        user1.save(err => {
          if (!err) {
            res.send({username:userInput,userId:userIdSet}); 
          }
        });
      } else {
        res.send({ username: "User name exists" });
      }
    }
    else {
      res.send("problem in err");
    }
  });

});



// // Not found middleware
// app.use((req, res, next) => {
//   return next({ status: 404, message: "not found" });
// });

// // // Error Handling middleware
// app.use((err, req, res, next) => {
//   let errCode, errMessage;

//   if (err.errors) {
//     // mongoose validation error
//     errCode = 400; // bad request
//     const keys = Object.keys(err.errors);
//     // report the first validation error
//     errMessage = err.errors[keys[0]].message;
//   } else {
//     // generic or custom error
//     errCode = err.status || 500;
//     errMessage = err.message || "Internal Server Error";
//   }
//   res
//     .status(errCode)
//     .type("txt")
//     .send(errMessage);
// });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
