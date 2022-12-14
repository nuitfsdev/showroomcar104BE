const express=require('express')
const router=new express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')
const nodemailer = require("nodemailer");
const jwt=require('jsonwebtoken');
const HoaDon = require('../models/hoadon');
const authAd = require('../middleware/authAd');
const emails=require('../email/resetPasswordEmail')
exports.getUserMe=async(req,res)=>{
    try{
        const hoadons=await HoaDon.find({makh: req.user.mauser})
        res.send({user: req.user,hoadons})
    }catch(e){
        res.status(500).send(e)
    }
}


exports.addUser=async (req,res)=>{
    const user=new User(req.body)
    try{
        if(await (await User.find({})).length!==0){
            const userLast= await (await User.find({})).splice(-1)
            const mauserLast= userLast[0].mauser.substring(2) || "0" 
            const newmauser="KH"+ Number(Number(mauserLast)+1)
            user.mauser=newmauser
        }
        await user.save()
        const token=await user.generateAuToken()
        res.status(201).send({user,token})
    } catch(e){ 
        res.status(500).send(e)
    }
}
exports.login=async(req,res)=>{
    try{
        const user= await User.findByCredentials(req.body.email, req.body.password)
        const token=await user.generateAuToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send({message: e.message})
    }
}
exports.logout=async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send('Successfully logout!')
    }catch(e){
        res.status(500).send(e)
    }
}

exports.logoutAll= async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.status(200).send('Logout all successfully')
    }catch(e){
        res.status(500).send(e)
    }
}
exports.updateMe=async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=["name","password","gioitinh","ngaysinh","sdt","diachi","cccd"]
    const isValidOperation=updates.every((update)=>{
        return allowUpdates.includes(update)
    })
    if(!isValidOperation)
    {
        return res.status(400).send("error: Invalid updates!")
    }
    try{
        const user= req.user
        updates.forEach((update)=>{
            user[update]=req.body[update]
        })
        await user.save()
        res.status(200).send(user)
    } catch(e){
        res.status(500).send(e)
    }
}
exports.deleteMe=async(req,res)=>{
    try{
        const userName=req.user.name
        await req.user.remove()
        res.status(200).send('Deleted user '+userName)
    }catch(e){
        res.status(500).send(e)
    }
}
exports.forgotPassword=async(req,res)=>{
    try{
        const email=req.body.email
        const user= await User.findOne({email: email})
        if(!user){
            return res.status(404).send("Email not exists")
        }
        const token=jwt.sign({_id: user._id.toString(), role: user.role}, process.env.JWT_SECRET,{expiresIn: '20m'})
        user.verifyToken=token
        await user.save()
        const sendEmail=emails.resetPasswordEmail(email,token)
        if(!sendEmail){
            return res.send({
                message: `Kh??ng th??? g???i mail ?????n ${email}`,
                err
            }).status(400)
        }
        return res.send({
            message: `???? g???i th??nh c??ng cho ${email}`
        })
    }catch(e){
        res.status(500).send(e)
    }
}
exports.resetPassword=async(req,res)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        if(!decode){
            throw new Error("Token is expired or wrong")
        }
        const user= await User.findOne({_id: decode._id, verifyToken: token})
        if(!user){
            return res.status(400).send("User not exist")
        }
        user.password=req.body.password
        await user.save()
        res.status(200).send(user)
    } catch(e){
        res.status(500).send(e.message)
    }
}