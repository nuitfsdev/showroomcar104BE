const express=require('express')
const router=new express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')

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
        res.status(400).send(e)
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

module.exports= router