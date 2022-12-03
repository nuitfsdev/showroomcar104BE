const express=require('express');
const authAd = require('../middleware/authAd');
const router=new express.Router()
const News=require('../models/news')

router.get('/news', async(req,res)=>{
    try{
        const limit=parseInt(req.query.pageSize) || 5;
        const skip=parseInt(req.query.pageIndex)*limit || 0;
        const news= await (await News.find({}).skip(skip).limit(limit)).sort({createdAt: -1});
        const totalNews=(await News.find({})).length;
        res.send({totalNews,news})
    }catch(e){
        res.status(500).send(e)
    }
    
})
router.get('/news/:id',async (req,res)=>{
    const _id=req.params.id
    try{
        const news= await News.findOne({_id})
        if(!news){
            return res.status(404).send("Not found")
        }
        res.send(news)
    }catch(e){
        res.status(500).send(e);
    }
})
router.post('/news',authAd,async (req, res)=>{

    const news= new News({
        ...req.body
    })
    try{
        await news.save()
        res.status(201).send(news)
    }catch(e){
        res.status(400).send(e)
    }
})
router.put('/news/:id',authAd,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=["author","title","image","description","dateSource","detail"]
    const isValidOperation=updates.every((update)=>{
        return allowUpdates.includes(update)
    })
    if(!isValidOperation)
    {
        return res.status(400).send("error: Invalid updates!")
    }
    try{
        const news=await News.findOne({_id: req.params.id})
        if(!news){
            return res.status(404).send("Not found")
        }
        updates.forEach((update)=>{
            news[update]=req.body[update]
        })
        await news.save()
        res.send(news)
    } catch(e){
        res.status(500).send(e)  
    }
})
router.delete('/news/:id',authAd, async(req,res)=>{
    try{
        const news= await News.findByIdAndDelete({_id: req.params.id})
        if(!news){
            return res.status(404).send("Not found")
        }
        res.send(news)
    }catch(e){
        res.status(500).send(e)
    }
})
module.exports= router