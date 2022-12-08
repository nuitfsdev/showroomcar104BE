const express=require('express')
const router=new express.Router()
const HoaDon=require('../models/hoadon')
const CTHD=require('../models/cthd')
const Car = require('../models/car')
const User = require('../models/user')
const authADandEP = require('../middleware/authADandEP')
const auth = require('../middleware/auth')
const order=require('../email/orderEmail')
const invoice=require('../email/invoiceEmail')



exports.getAllHoadons=async(req,res)=>{
    try{
        const limit=parseInt(req.query.pageSize) || 5;
        const skip=parseInt(req.query.pageIndex)*limit || 0;
        let filter={}
        if(req.query.tinhtrang){
            filter.tinhtrang=req.query.tinhtrang
        }
        if(req.query.mahd){
            filter.mahd=req.query.mahd
        }
        const hoadons= await HoaDon.find(filter).skip(skip).limit(limit);
        const totalHoaDon=(await HoaDon.find(filter)).length;
        res.send({totalHoaDon, hoadons})
    }catch(e){
        res.status(500).send(e)
    }
    
}
exports.getHoadonByID=async (req,res)=>{
    const _id=req.params.id
    try{
        const hoadon= await HoaDon.findOne({_id})
        if(!hoadon){
            return res.status(404).send("Not found")
        }
        const cthds=await CTHD.find({mahd: hoadon.mahd})
        res.send({hoadon,cthds})
    }catch(e){
        res.status(500).send(e);
    }
}
exports.addHoadon=async (req, res)=>{

    try{
        const khachhang=await User.findOne({mauser: req.body.hoadon.makh})
        if(!khachhang){
            return res.status(404).send("Not found khachhang: "+ req.body.hoadon.makh)
        }
        const hoadon= new HoaDon({
            ...req.body.hoadon
        })
        if(await (await HoaDon.find({})).length!==0){
            const hoadonLast= await (await HoaDon.find({})).splice(-1)
            const mahoadonLast= hoadonLast[0].mahd.substring(2) || "0" 
            const newmahoadon="HD"+ Number(Number(mahoadonLast)+1)
            hoadon.mahd=newmahoadon
        }
        hoadon.tenkh=khachhang.name
        const cthds=req.body.cthd
        for(var item of cthds){
            const car=await Car.findOne({macar: item.macar})
            if(!car){
               return res.status(404).send(`Not found MaCar: ${item.macar}`)
            }
            if(item.soluong>car.soluong){
               return res.status(400).send(`Not enough Car: ${item.macar}`)
            }
               
        }
        let sendEmail=false
        if(hoadon.tinhtrang==="Chưa thanh toán"){
            sendEmail= await order.orderEmail(khachhang.email,hoadon,cthds)
        }
        else{
            sendEmail= await invoice.invoiceEmail(khachhang.email,hoadon,cthds)
        }
        if(!sendEmail){
           return res.status(400).send("Can not send order email")
        }
        for(var item of cthds){
            const car=await Car.findOne({macar: item.macar})
            const  cthd= new CTHD({
                mahd: hoadon.mahd,
                macar: item.macar,
                tenxe: car.ten,
                soluong: item.soluong,
                gia: car.gia
            })
            car.soluong=car.soluong-item.soluong
            await car.save()
            await cthd.save()
        }
        await hoadon.save()
        res.status(201).send({hoadon,cthds})
    }catch(e){
        res.status(500).send(e.message)
    }
}
exports.updateHoadon=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=["tinhtrang"]
    const isValidOperation=updates.every((update)=>{
        return allowUpdates.includes(update)
    })
    if(!isValidOperation)
    {
        return res.status(400).send("error: Invalid updates!")
    }
    try{
        const hoadon=await HoaDon.findOne({_id: req.params.id})
        if(!hoadon){
            return res.status(404).send("Not found")
        }
        if(hoadon.tinhtrang==="Đã thanh toán"){
            return res.status(400).send("Can not update this bill")
        }
        updates.forEach((update)=>{
            hoadon[update]=req.body[update]
        })
        const khachhang=await User.findOne({mauser: hoadon.makh})
        const cthds=await CTHD.find({mahd: hoadon.mahd})
        const sendEmail=await invoice.invoiceEmail(khachhang.email,hoadon,cthds)
        if(!sendEmail)
        {
            return res.status(400).send("Can not send invoice email")
        }
        await hoadon.save()
        res.send(hoadon)
    } catch(e){
        res.status(500).send(e.message)  
    }
}
exports.deleteHoadon=async(req,res)=>{
    try{
        const hoadon= await HoaDon.findById(req.params.id)
        if(hoadon.tinhtrang==="Đã thanh toán"){
            return res.status(400).send("Can not delete this bill")
        }
        const hoadonDelete= await HoaDon.findByIdAndDelete({_id: req.params.id})
        if(!hoadonDelete){
            return res.status(404).send("Not found")
        }
        const cthds=await CTHD.find({mahd: hoadonDelete.mahd})
        await CTHD.deleteMany({mahd: hoadonDelete.mahd})
        for(var item of cthds){
            const car= await Car.findOne({macar: item.macar})
            car.soluong=car.soluong+item.soluong
            car.save()
        }
        res.send(hoadonDelete)
    }catch(e){
        res.status(500).send(e)
    }
}