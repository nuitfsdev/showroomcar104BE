const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
            console.log(validator.isEmail(value))
        }
    },
    mauser:{
        type: String,
        default: "KS0"
    },
    gioitinh:{
        type: String,
    },
    ngaysinh:{
        type: String,
    },
    sdt:{
        type: String,
    },
    diachi:{
        type: String,
    },
    chucvu:{
        type: String,
    },
    cccd:{
        type: String,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        validate(value){
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('Password can not contain "password"')
            }
        }

    },
    role: {
        type: String,
        default: "customer",
        required: true,
        trim: true,
    },
    verifyToken:{
        type: String,
        trim: true
    }
    ,
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
},{
    timestamps: true
})

userSchema.methods.generateAuToken= async function(){
    const user = this
    const token=jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET,{expiresIn: '30d'})
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.verifyToken
    return userObject
}
userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error('Unable to login') 
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        throw new Error('Unable to login') 
    }
    return user
}
userSchema.pre('save', async function(next){
    const user=this
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password, 8)
    }
    if(user.isModified('role')){
        console.log(user.role)
        if(user.role==="employee"){
            const mauserNumber= user.mauser.substring(2) || "0";
            const newmauser="NV"+ Number(mauserNumber)
            user.mauser=newmauser
        }
        if(user.role==="admin"){
            const mauserNumber= user.mauser.substring(2) || "0";
            const newmauser="AD"+ Number(mauserNumber)
            user.mauser=newmauser
        }
        if(user.role==="customer"){
            const mauserNumber= user.mauser.substring(2) || "0";
            const newmauser="KH"+ Number(mauserNumber)
            user.mauser=newmauser
        }
    }
    next()
})
const User=mongoose.model('User',userSchema)
module.exports = User
