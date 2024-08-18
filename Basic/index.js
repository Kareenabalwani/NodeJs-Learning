const express = require('express')
const db = require("./db");
const bodyParser = require("body-parser");
const Person = require('./Models/Person');

const passport = require('passport');
const LocalStrategy = require('passport-local');

require('dotenv').config();

const app = express()
const port = process.env.PORT || 3000;
app.use(bodyParser.json()) //middleware



passport.use(new LocalStrategy(async (username,password,done)=>{
 try{
  console.log("Credentials received",username,password);
  const user = await Person.findOne({email:username});
  console.log(user);
  if(!user){
    return done(null,false,{message:"User not found"});
  }
  const IsPasswordMatched = await user.comparePassword(password);
  console.log(IsPasswordMatched);
  if(!IsPasswordMatched){
    return done(null,false,{message:"password does not matched!"} );
  }else{
    return done(null,user,{message:"Authenticated successfully"});
  }
 }catch(err){
  console.log("error");
  return done(err);
 }

}))


const loggerMiddleware = (req,res,next)=>{
  console.log(`[${new Date().toLocaleString()}] request made to ${req.originalUrl}`)
  next();
}

app.use(passport.initialize());
const localAuth = passport.authenticate('local',{session:false});
app.get('/',localAuth, (req, res) => {
  res.send('Hello World!')
})
  
const personRoutes = require('./routes/PersonRoutes')
app.use('/person',loggerMiddleware,personRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})