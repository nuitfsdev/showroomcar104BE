const jwt=require('jsonwebtoken')
const User=require('../models/user')

const authADandEP=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        if(decode.role=="customer"){
            return res.status(400).send("User not permission to access")
        }
        const user=await User.findOne({_id: decode._id,'tokens.token': token})
        if(!user)
        {
            return res.status(404).send("User not exits")
        }
        req.token=token
        req.user=user
        next()
    }catch(e){
        res.status(401).send('Error: Please authenticate!')
    }
}
module.exports=authADandEP