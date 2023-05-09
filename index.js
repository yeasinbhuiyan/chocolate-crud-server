
const express = require('express');
 const cors = require('cors');
 const app = express()

 const port = process.env.PORT || 5000


//  middlewear
 app.use(cors())
 app.use(express.json())


 app.get('/',(req,res)=>{
    res.send('This Is Chocolate Server')
 })

 app.listen(port,()=>{
    console.log(`This Server Port is ${port}`)
 })