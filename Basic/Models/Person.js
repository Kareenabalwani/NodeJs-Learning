const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const personSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
    },
    work:{
        type:String,
        required:true,
        enum:['chef','lawyer','enterprenuer','doctor']
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true
    }
})
//fucntion keyword to use "this"
personSchema.pre('save',async function (next){
    try{
        const person = this;
        if(!person.isModified('password')) return next();

        const salt =await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(person.password,salt);
        person.password = hashedPassword;
        next();
    }catch(err){
return next(err);
    }
})
personSchema.methods.comparePassword = async function(candidatePassword){
 
    try{
        const isMatched = await bcrypt.compareSync(candidatePassword,this.password);
        return isMatched;
    }catch(err){
        console.log("========>errrrrror");   
        throw err;
    }
  
}
const Person = mongoose.model("Person",personSchema);
module.exports = Person;