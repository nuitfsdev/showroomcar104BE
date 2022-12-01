const mongoose=require('mongoose')
const validator=require('validator')
const formSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
            console.log(validator.isEmail(value))
        }
    },
    message: {
        type: String,
        trim: true,
    }
},{timestamps: true})
const Form=mongoose.model('Form',formSchema)
module.exports= Form