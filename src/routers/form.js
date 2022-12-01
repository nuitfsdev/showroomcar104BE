const express=require('express')
const router=new express.Router()
const Form=require('../models/form')

router.get('/forms', async(req,res)=>{
    try{
        const limit=parseInt(req.query.pageSize) || 15;
        const skip=parseInt(req.query.pageIndex)*limit || 0;
        const forms= await Form.find({}).skip(skip).limit(limit);
        const totalForms=forms.length;
        res.send({totalForms,forms})
    }catch(e){
        res.status(500).send(e)
    }
    
})
router.get('/forms/:id',async (req,res)=>{
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
router.delete('/forms/:id', async(req,res)=>{
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