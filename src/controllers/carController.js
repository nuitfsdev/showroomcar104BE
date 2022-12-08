const express=require('express');
const authADandEP = require('../middleware/authADandEP');
const auth=require('../middleware/auth')
const router=new express.Router()
const Car=require('../models/car');
const authAd = require('../middleware/authAd');

exports.getAllCar=async(req,res)=>{
    try{
        const limit=parseInt(req.query.pageSize) || 15;
        const skip=parseInt(req.query.pageIndex)*limit || 0;
        const filter={};
        if(req.query.ten){
            filter.ten={ "$regex": req.query.ten, "$options": "i" }
        }
        if(req.query.thuonghieu){
            filter.thuonghieu={ "$regex": req.query.thuonghieu, "$options": "i" }
        }
        if(req.query.macar){
            filter.macar=req.query.macar
        }
        const cars= await Car.find(filter).skip(skip).limit(limit);
        const totalCarsFilter=await (await Car.find(filter)).length;
        const totalCars=await (await Car.find({})).length;
        res.send({totalCars,totalCarsFilter,cars})
    }catch(e){
        res.status(500).send()
    }  
}

exports.getCarByID=async (req,res)=>{
    const _id=req.params.id
    try{
        const car= await Car.findOne({_id})
        if(!car){
            return res.status(404).send("Not found")
        }
        res.send(car)
    }catch(e){
        res.status(500).send(e);
    }
}