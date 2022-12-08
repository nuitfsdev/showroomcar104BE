const express=require('express');
const authAd = require('../middleware/authAd');
const router=new express.Router()
const User=require('../models/user')
const employeeController=require('../controllers/employeeController')

router.get('/users/employees',authAd, employeeController.getAllEmployees )
router.get('/users/employees/:id',authAd , employeeController.getEmployeeByID)
router.post('/users/employees',authAd, employeeController.addEmployee)
router.put('/users/employees/:id',authAd, employeeController.updateEmployee)
router.delete('/users/employees/:id', employeeController.deleteEmployee)


module.exports= router