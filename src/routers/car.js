const express=require('express')
const router=new express.Router()
const Car=require('../models/car')

router.get('/cars', async(req,res)=>{
    try{
        const limit=parseInt(req.query.pageSize) || 15;
        const skip=parseInt(req.query.pageIndex)*limit || 0;
        const filter={};
        if(req.query.ten){
            filter.ten={ "$regex": req.query.ten, "$options": "i" }
        }
        if(req.query.thuonghieu){
            filter.thuonghieu=req.query.thuonghieu
        }
        const cars= await Car.find(filter).skip(skip).limit(limit);
        const totalCars=await (await Car.find({})).length;
        res.send({cars,totalCars})
    }catch(e){
        res.status(500).send()
    }
    
})
router.get('/cars/:id',async (req,res)=>{
    const _id=req.params.id
    try{
        const car= await Car.findOne({_id})
        if(!car){
            return res.status(404).send()
        }
        res.send(car)
    }catch(e){
        res.status(500).send()
    }
})
router.post('/cars',async (req, res)=>{
    const car= new Car({
        ...req.body
    })
    try{
        await car.save()
        res.status(201).send(car)
    }catch(e){
        res.status(400).send(e)
    }
})
router.put('/cars/:id',async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=["ten","thuonghieu","socho","dongco","kichthuoc","nguongoc","vantoctoida","dungtich", "tieuhaonhienlieu","congsuatcucdai","mausac","gia","hinhanh","mota","namsanxuat"]
    const isValidOperation=updates.every((update)=>{
        return allowUpdates.includes(update)
    })
    if(!isValidOperation)
    {
        return res.status(400).send("error: Invalid updates!")
    }
    try{
        const car=await Car.findOne({_id: req.params.id})
        if(!car){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            car[update]=req.body[update]
        })
        await car.save()
        res.send(car)
    } catch(e){
        res.status(500).send(e)  
    }
})
router.delete('/cars/:id', async(req,res)=>{
    try{
        const car= await Car.findByIdAndDelete({_id: req.params.id})
        if(!car){
            return res.status(404).send()
        }
        res.send(car)
    }catch(e){
        res.status(500).send(e)
    }
})
module.exports= router