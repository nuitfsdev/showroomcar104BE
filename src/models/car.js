const mongoose=require('mongoose')
//const validator=require('validator')
const carSchema=new mongoose.Schema({
    macar:{
        type:String,
        default: "OT00"
    },
    ten: {
        type: String,
        required: true,
        trim: true,
    },
    thuonghieu: {
        type: String,
        required: true,
        trim: true,
    },
    dongco: {
        type: String,
        required: true,
        trim: true,
    },
    socho: {
        type: Number,
        required: true,
        trim: true,
    },
    kichthuoc: {
        type: String,
        required: true,
        trim: true,
    },
    nguongoc: {
        type: String,
        required: true,
        trim: true,
    },
    vantoctoida: {
        type: String,
        required: true,
        trim: true,
    },
    dungtich: {
        type: String,
        required: true,
        trim: true,
    },
    tieuhaonhienlieu: {
        type: String,
        required: true,
        trim: true,
    },
    congsuatcucdai: {
        type: String,
        required: true,
        trim: true,
    },
    mausac: {
        type: String,
        required: true,
        trim: true,
    },
    gia: {
        type: Number,
        required: true,
        trim: true,
    },
    hinhanh: {
        type: String,
        required: true,
        trim: true,
    },
    mota: {
        type: String,
        required: true,
        trim: true,
    },
    namsanxuat: {
        type: Number,
        required: true,
        trim: true,
    },
    soluong: {
        type: Number,
        default: 0,
        required: true,
    },
},{timestamps: true})
const Car=mongoose.model('Car',carSchema)
module.exports= Car