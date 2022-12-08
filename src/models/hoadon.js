const mongoose=require('mongoose')
//const validator=require('validator')
const hoadonSchema=new mongoose.Schema({
    mahd: {
        type: String,
        default: "HD0",
        required: true,
        trim: true,
    },
    manv: {
        type: String,
        required: true,
        trim: true,
    },
    makh: {
        type: String,
        required: true,
        trim: true,
    },
    tenkh: {
        type: String,
        required: true,
        trim: true
    },
    ngayhd: {
        type: String,
        required: true,
        trim: true,
    },
    tinhtrang: {
        type: String,
        trim: true,
    },
    trigia: {
        type: Number,
        default: 0,
        required: true,
    }
},{timestamps: true})
const HoaDon=mongoose.model('HoaDon',hoadonSchema)
module.exports= HoaDon