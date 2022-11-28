const mongoose=require('mongoose')
//const validator=require('validator')
const newsSchema=new mongoose.Schema({
    link: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    dateSource: {
        type: String,
        trim: true,
    },
    detail: {
        type: Array,
        required: true,
    }
},{timestamps: true})
const News=mongoose.model('News',newsSchema)
module.exports= News