const express=require('express');
const authAd = require('../middleware/authAd');
const router=new express.Router()
const User=require('../models/user')


router.get('/users/employees',authAd, async(req,res)=>{
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
        filter.role="employee"
        const employees= await User.find(filter).skip(skip).limit(limit);
        const totalEmployeesFilter=await (await User.find(filter)).length;
        const totalEmployees=await(await User.find(filter)).length;
        res.send({totalEmployees,totalEmployeesFilter,employees})
    }catch(e){
        res.status(500).send(e)
    }
})
router.get('/users/employees/:id',authAd , async(req,res)=>{
    try{
        const user= await User.findOne({_id: req.params.id, role: "employee"})
        if(!user){
            return res.status(404).send("Not found")
        }
        res.send(user)
    }catch{
        res.status(500).send(e)
    }
})
router.post('/users/employees',authAd, async (req,res)=>{
    const user=new User(req.body)
    try{
        if(await (await User.find({})).length!==0){
            const userLast= await (await User.find({})).splice(-1)
            const mauserLast= userLast[0].mauser.substring(2) || "0" 
            const newmauser="NV"+ Number(Number(mauserLast)+1)
            user.mauser=newmauser
        }
        user.role="employee"
        await user.save()
        const token=await user.generateAuToken()
        res.status(201).send({user,token})
    } catch(e){ 
        res.status(500).send(e)
    }
})
router.put('/users/employees/:id',authAd, async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=["name","gioitinh","ngaysinh","sdt","diachi","chucvu","cccd"]
    const isValidOperation=updates.every((update)=>{
        return allowUpdates.includes(update)
    })
    if(!isValidOperation)
    {
        return res.status(400).send("error: Invalid updates!")
    }
    try{
        const user= await User.findOne({_id: req.params.id, role: "employee"})
        updates.forEach((update)=>{
            user[update]=req.body[update]
        })
        await user.save()
        res.status(200).send(user)
    } catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/employees/:id', async(req,res)=>{
    try{
        const userName= await User.findOne({_id: req.params.id, role: "employee"})
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