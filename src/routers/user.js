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
        await user.save()
        const token=await user.generateAuToken()
        res.send({user,token})
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
        console.log(user.verifyToken)
        await user.save()
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'kingspeedmail@gmail.com',
                pass: 'ovprwckifgobfyeh'
            },
        });
        transporter.sendMail({
            from: "kingspeedmail@gmail.com", // sender address
            to: `${email}`, // list of receivers
            subject: "KingSpeed: Quên mật khẩu", // Subject line
            text: "Quên mật khẩu?", // plain text body
            html: `<h3>Vui lòng truy cập link <a href="http://localhost:3001/register/${user._id}/${token}">này</a> để thiết lập lại mật khẩu. Link có thời hạn 20 phút.</h3>`, // html body
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
router.put('/users/setupPassword', async(req,res)=>{
    try{
        const user= await User.findOne({_id: req.body.id, verifyToken: req.body.verifyToken})
        if(!user){
            return res.status(400).send("User not exist")
        }
        user.password=req.body.password
        await user.save()
        res.status(200).send(user)
    } catch(e){
        res.status(500).send(e)
    }
})

module.exports= router