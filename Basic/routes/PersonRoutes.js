const express = require('express');
const Person = require('../Models/Person');
const {jwtMiddleware,generateToken} = require('../jwt');
const router = express.Router();
router.post('/signup', async(req, res) => {
    try{
        const data = req.body;
        const newPerson = new Person(data);
        const response =await newPerson.save();
        const payload = {
          id:newPerson.id,
          email:newPerson.email
        }
        const token = generateToken(payload);
        console.log("token generated",token);
        res.status(200).json({data:response,token:token});
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    }
   
  })

  router.post('/login', async(req, res) => {
    try{
        const {email,password} = req.body;
        const user =await Person.findOne({email:email});
        if(!user || ! (await user.comparePassword(password) )){
          res.status(400).json({message:"Invalid user or password"});
        }
        const payload = {
          id:user.id,
          email:user.email
        }
        const token = generateToken(payload);
        console.log("token generated",token);
        res.status(200).json({data:user,token:token});
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    }
   
  })
  router.get('/', jwtMiddleware,async(req,res) => {
    try{
        
        const response =await Person.find();
        res.status(200).json({data:response});
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    }
   
  })
  router.get('/profile', jwtMiddleware, async (req, res) => {
    try {
        const userdata = req.user;
        const response = await Person.findById(userdata.id);
        if (!response) {
            return res.status(404).json({ message: "Person with given id not found!" });
        }
        res.status(200).json({ data: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

  router.get('/:worktype', async(req, res) => {
    try{
        
      const workType = req.params.worktype;
      console.log("===============>",workType);
      if(workType != "chef" && workType != "lawyer"  && workType !="enterprenuer" && workType !="doctor")
        {
          res.status(400).json({message:"Invalid worktype"});
        }
        const response =await Person.find({work:workType});
        res.status(200).json({data:response});
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    }
   
  });


 

  router.put('/:id', async(req, res) => {
    try{
        
      const id = req.params.id;
      const body = req.body;

        const response =await Person.findByIdAndUpdate(id,body,{
            new:true,
            runValidators:true
        });
        if(!response){
            res.status(404).json({message:"Person with given id not found!"})
        }
        res.status(200).json({data:response});
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    }
   
  })

  router.delete('/:id', async(req, res) => {
    try{
        
      const id = req.params.id;

        const response =await Person.findByIdAndDelete(id);
        if(!response){
            res.status(404).json({message:"Person with given id not found!"}) 
        }
        res.status(200).json({data:"Person deleted successfully!"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:err});
    }
   
  })
  module.exports=router;