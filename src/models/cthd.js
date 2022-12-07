const mongoose=require('mongoose')
//const validator=require('validator')
const cthdSchema=new mongoose.Schema({
    mahd: {
        type: String,
        required: true,
        trim: true,
    },
    macar: {
        type: String,
        required: true,
        trim: true,
    },
    tenxe: {
        type: String,
        trim: true,
    },
    soluong: {
        type: Number,
        default: 0
    },
    gia: {
        type: Number,
        default: 0
    }
},{timestamps: true})
const CTHD=mongoose.model('CTHD',cthdSchema)
module.exports= CTHD