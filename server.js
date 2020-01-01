const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )
//create a collection schema
const userSchema = {
    username: {type :String ,
               required: true},
    userId : String
};
const exerciceSchema = {
    user: {userSchema},
    description : {type:String ,required:true},
    duration : {type:Number , required:true},
    date : String
};
// create a model from the schema
const userColModel = mongoose.model("user", userSchema);
const exerciceColModel = mongoose.model("exercice", exerciceSchema);
app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'));
app.post("/api/exercise/new-user",(req, res)=>{
  var username = req.body.username;
  userColModel.find({username: username}, function (err, usersfound) {
        if (usersfound===null){
          const user = new itemColModel({
    username: username
});
          user.save(function(err){
                cb(err,user);
            });
            
        }else{
          console.log('Name exists already');
        }
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
