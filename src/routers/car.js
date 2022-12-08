const express=require('express');
const authADandEP = require('../middleware/authADandEP');
const auth=require('../middleware/auth')
const router=new express.Router()
const Car=require('../models/car');
const authAd = require('../middleware/authAd');
const carController=require('../controllers/carController')
router.get('/cars', carController.getAllCar)
router.get('/cars/:id',carController.getCarByID)
router.post('/cars',authAd,async (req, res)=>{
    const car= new Car({
        ...req.body
    })
    try{
        if(await (await Car.find({})).length!==0){
            const carLast= await (await Car.find({})).splice(-1)
            const macarLast= carLast[0].macar.substring(2) || "0" 
            const newmacar="OT"+ Number(Number(macarLast)+1)
            car.macar=newmacar
        }
        await car.save()
        res.status(201).send(car)
    }catch(e){
        res.status(400).send(e)
    }
})
router.put('/cars/:id',authAd,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=["ten","thuonghieu","socho","dongco","kichthuoc","nguongoc","vantoctoida","dungtich", "tieuhaonhienlieu","congsuatcucdai","mausac","gia","hinhanh","mota","namsanxuat","soluong"]
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
router.delete('/cars/:id',authAd, async(req,res)=>{
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