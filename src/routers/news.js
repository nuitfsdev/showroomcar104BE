const express=require('express')
const router=new express.Router()
const News=require('../models/news')

router.get('/news', async(req,res)=>{
    try{
        const limit=parseInt(req.query.pageSize) || 5;
        const skip=parseInt(req.query.pageIndex)*limit || 0;
        const news= await News.find({}).skip(skip).limit(limit);
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
router.post('/news',async (req, res)=>{

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
router.put('/news/:id',async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=["link","title","image","description","dataSource","detail"]
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
router.delete('/news/:id', async(req,res)=>{
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