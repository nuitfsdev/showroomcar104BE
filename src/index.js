const express = require('express')
require('./db/mongoose')
const carRouter=require('./routers/car')
const app = express()

const port=process.env.PORT || 3000
app.use(express.json())
app.use(carRouter)

app.listen(port, ()=>{
  console.log('Server is up on PORT '+port)
})