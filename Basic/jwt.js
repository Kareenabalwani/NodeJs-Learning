const jwt = require('jsonwebtoken');

const jwtMiddleware = (req,res,next)=>{
    if(!req.headers.authorization){
        res.status(401).json({ error:"Invalid Token"});
    }
    var token = req.headers.authorization.split(' ')[1];
    if(!token){
        res.status(401).json({ error:"unauthorized"});
    }

    try{
       const decoded =  jwt.verify(token,process.env.JWT_KEY);
       req.user = decoded;
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({ error:"Invalid token"});
    }
}

const generateToken = (userdata)=>{
    const token = jwt.sign(userdata,process.env.JWT_KEY,{expiresIn:300000});
    return token;
}
module.exports = {jwtMiddleware,generateToken};