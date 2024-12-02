const express= require('express');
const app=express();
require('dotenv/config');
const bodyParser=require('body-parser');
const morgan=require('morgan');
const mongoose=require('mongoose')
const Product=require('./models/products');
const productRouter=require('./routes/products');
const categoryRouter=require('./routes/category');
const userRoute=require('./routes/user');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const orderRoute=require('./routes/order');

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);
  

app.use('/products',productRouter)
app.use('/categories',categoryRouter)
app.use('/users',userRoute)
app.use('/orders',orderRoute)
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
      console.log("connected succefully");
})
.catch((err)=>{
      console.log(err);
})

app.listen(3000,()=>{
      console.log("connectedSuccefully")
})