const express=require('express')
const router=new express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')
const nodemailer = require("nodemailer");
const jwt=require('jsonwebtoken');
const HoaDon = require('../models/hoadon');
const authAd = require('../middleware/authAd');
const userController=require('../controllers/userController')

router.get('/users/me', auth ,userController.getUserMe )
router.post('/users', userController.addUser)
router.post('/users/login', userController.login)
router.post('/users/logout',auth,userController.logout)
router.post('/users/logoutAll', auth, userController.logoutAll)
router.put('/users/me',auth, userController.updateMe)
router.delete('/users/me',auth, userController.deleteMe)
router.post('/users/forgotPassword', userController.forgotPassword)
router.put('/users/resetPassword', userController.resetPassword)

// router.put('/users/role',authAd, async(req,res)=>{
//     const updates=Object.keys(req.body)
//     const allowUpdates=["email","role"]
//     const isValidOperation=updates.every((update)=>{
//         return allowUpdates.includes(update)
//     })
//     if(!isValidOperation)
//     {
//         return res.status(400).send("error: Invalid updates!")
//     }
//     try{
//         const user= await User.findOne({email: req.body.email})
//         if(!user){
//             return res.status(404).send("Not found")
//         }
//         user.role=req.body.role
//         user.tokens=[]
//         await user.save()
//         res.status(200).send(user)
//     } catch(e){
//         res.status(500).send(e)
//     }
// })

module.exports= router