const express=require('express');
const authADandEP = require('../middleware/authADandEP');
const router=new express.Router()
const Form=require('../models/form')

router.get('/forms',authADandEP, async(req,res)=>{
    try{
        const limit=parseInt(req.query.pageSize) || 15;
        const skip=parseInt(req.query.pageIndex)*limit || 0;
        const filter={}
        let forms= await Form.find({filter}).skip(skip).limit(limit).sort({createdAt: -1});
        let totalForms=await (await Form.find({filter})).length;
        if(req.query.dateForm){
            const formsDate= await Form.find(filter)
            const formsDateFilter=formsDate.filter((i)=>i.createdAt.toLocaleDateString("es-CL")===req.query.dateForm)
            forms=formsDateFilter.slice(skip,skip+limit)
            totalForms=formsDateFilter.length
            
        }
        res.send({totalForms,forms})
    }catch(e){
        res.status(500).send(e)
    }
    
})
router.get('/forms/:id',authADandEP,async (req,res)=>{
    const _id=req.params.id
    try{
        const form= await Form.findOne({_id})
        if(!form){
            return res.status(404).send("Not found")
        }
        res.send(form)
    }catch(e){
        res.status(500).send(e);
    }
})
router.post('/forms',async (req, res)=>{
    const form= new Form({
        ...req.body
    })
    try{
        await form.save()
        res.status(201).send(form)
    }catch(e){
        res.status(400).send(e)
    }
})
router.delete('/forms/:id',authADandEP, async(req,res)=>{
    try{
        const form= await Form.findByIdAndDelete({_id: req.params.id})
        if(!form){
            return res.status(404).send("Not found")
        }
        res.send(form)
    }catch(e){
        res.status(500).send(e)
    }
})
module.exports= router