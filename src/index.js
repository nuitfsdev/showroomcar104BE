const express = require('express')
require('./db/mongoose')
const cors=require('cors')
const carRouter=require('./routers/car')
const userRouter=require('./routers/user')
const app = express()

const port=process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use(carRouter)
app.use(userRouter)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.listen(port, ()=>{
  console.log('Server is up on PORT '+port)
})