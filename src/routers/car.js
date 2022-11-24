const express=require('express')
const router=new express.Router()
const Car=require('../models/car')

router.get('/cars', async(req,res)=>{
    try{
        const cars= await Car.find({})
        res.send(cars)
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
    //const task= new Task(req.body)
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
router.patch('/cars/:id',async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=["ten","thuonghieu","dongco","kichthuoc","nguongoc","vantocdoida","dungtich", "tieuhaonhienlieu","congsuatcucdai","mausac","gia","hinhanh","mota","namsanxuat"]
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