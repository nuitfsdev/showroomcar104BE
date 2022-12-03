const express=require('express');
const authADandEP = require('../middleware/authADandEP');
const router=new express.Router()
const User=require('../models/user')

router.get('/users/customers',authADandEP, async(req,res)=>{
    try{
        const limit=parseInt(req.query.pageSize) || 15;
        const skip=parseInt(req.query.pageIndex)*limit || 0;
        const filter={};
        if(req.query.name){
            filter.name={ "$regex": req.query.name, "$options": "i" }
        }
        if(req.query.mauser){
            filter.mauser=req.query.mauser
        }
        if(req.query.email){
            filter.email=req.query.email
        }
        filter.role="customer"
        const customers= await User.find(filter).skip(skip).limit(limit);
        const totalCustomersFilter=await (await User.find(filter)).length;
        const totalCustomers=await(await User.find(filter)).length;
        res.send({totalCustomers,totalCustomersFilter,customers})
    }catch(e){
        res.status(500).send(e)
    }
})
router.get('/users/customers/:id',authADandEP , async(req,res)=>{
    try{
        const user= await User.findOne({_id: req.params.id, role: "customer"})
        if(!user){
            return res.status(404).send("Not found")
        }
        res.send(user)
    }catch{
        res.status(500).send(e)
    }
})
router.put('/users/customers/:id',authADandEP, async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=["name","gioitinh","ngaysinh","sdt","diachi","cccd"]
    const isValidOperation=updates.every((update)=>{
        return allowUpdates.includes(update)
    })
    if(!isValidOperation)
    {
        return res.status(400).send("error: Invalid updates!")
    }
    try{
        const user= await User.findOne({_id: req.params.id, role: "customer"})
        updates.forEach((update)=>{
            user[update]=req.body[update]
        })
        await user.save()
        res.status(200).send(user)
    } catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/customers/:id',authADandEP, async(req,res)=>{
    try{
        const userName= await  User.findOne({_id: req.params.id, role: "customer"})
        if(!userName){
            return res.status(404).send("Not found")
        }
        await userName.remove()
        res.status(200).send('Deleted employee')
    }catch(e){
        res.status(500).send(e)
    }
})


module.exports= router