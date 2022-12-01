const express=require('express')
const router=new express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')
const nodemailer = require("nodemailer");
const jwt=require('jsonwebtoken')

router.get('/users/me', auth , async(req,res)=>{
    res.send(req.user)
})

router.post('/users', async (req,res)=>{
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
        res.status(400).send(e)
    }
})
router.post('/users/login', async(req,res)=>{
    try{
        const user= await User.findByCredentials(req.body.email, req.body.password)
        const token=await user.generateAuToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send({message: e.message})
    }
})
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send('Successfully logout!')
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.status(200).send('Logout all successfully')
    }catch(e){
        res.status(500).send(e)
    }
})

router.put('/users/me',auth, async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=["name","password","email"]
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
})
router.put('/users/role/:id', async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowUpdates=["role"]
    const isValidOperation=updates.every((update)=>{
        return allowUpdates.includes(update)
    })
    if(!isValidOperation)
    {
        return res.status(400).send("error: Invalid updates!")
    }
    try{
        const user= await User.findOne({_id: req.params.id})
        user.role=req.body.role
        await user.save()
        res.status(200).send(user)
    } catch(e){
        res.status(500).send(e)
    }
})
router.delete('/users/me',auth, async(req,res)=>{
    try{
        const userName=req.user.name
        await req.user.remove()
        res.status(200).send('Deleted user '+userName)
    }catch(e){
        res.status(500).send(e)
    }
})
router.post('/users/forgotPassword', async(req,res)=>{
    try{
        const email=req.body.email
        const user= await User.findOne({email: email})
        if(!user){
            return res.status(404).send("Email not exists")
        }
        const token=jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET,{expiresIn: '20m'})
        user.verifyToken=token
        await user.save()
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USERMAIL,
                pass: process.env.PASSMAIL
            },
        });
        transporter.sendMail({
            from: process.env.USERMAIL, // sender address
            to: `${email}`, // list of receivers
            subject: "KingSpeed: Quên mật khẩu", // Subject line
            text: "Quên mật khẩu?", // plain text body
            html: `<h3>Vui lòng truy cập link <a href="${process.env.URLCLIENT}/register/${token}">này</a> để thiết lập lại mật khẩu. Link có thời hạn 20 phút.</h3>`, // html body
            },(err)=>{
                if(err){
                    return res.send({
                        message: `Không thể gửi mail đến ${email}`,
                        err
                    }).status(400)
                }
                return res.send({
                    message: `Đã gửi thành công cho ${email}`
                })
            });
    }catch(e){
        res.status(500).send(e)
    }
})
router.put('/users/resetPassword', async(req,res)=>{
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
})

module.exports= router