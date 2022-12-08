const express=require('express');
const authADandEP = require('../middleware/authADandEP');
const router=new express.Router()
const Form=require('../models/form')
const formController=require('../controllers/formController')

router.get('/forms',authADandEP,formController.getAllForms )
router.get('/forms/:id',authADandEP,formController.getFormByID)
router.post('/forms',formController.addForm)
router.delete('/forms/:id',authADandEP, formController.deleteForm)

module.exports= router