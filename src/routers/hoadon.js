const express=require('express')
const router=new express.Router()
const HoaDon=require('../models/hoadon')
const CTHD=require('../models/cthd')
const Car = require('../models/car')
const User = require('../models/user')
const authADandEP = require('../middleware/authADandEP')
const auth = require('../middleware/auth')
const hoadonController=require('../controllers/hoadonController')


router.get('/hoadons',authADandEP,hoadonController.getAllHoadons )
router.get('/hoadons/:id',auth,hoadonController.getHoadonByID)
router.post('/hoadons',authADandEP,hoadonController.addHoadon)
router.put('/hoadons/:id',authADandEP,hoadonController.updateHoadon)
router.delete('/hoadons/:id',authADandEP, hoadonController.deleteHoadon)
module.exports= router