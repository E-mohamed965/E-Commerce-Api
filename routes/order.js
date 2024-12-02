const express=require('express');
const {Order}=require('../models/order');
const Router=express.Router();
const {OrderItem}=require('../models/order-item');
const { populate } = require('dotenv');

Router.get('/',async(req,res)=>{
    const orderList=await Order.find()
    .populate('user','name')
    .populate({path:'orderItems',populate:'product'})
    .sort({'dateOrdered':-1});
    if(!orderList.length){
        res.status(404).send('no orders');
    }
    else{
        res.status(200).send(orderList)
    }
});

Router.post('/', async (req, res) => {
    try {
        // Resolve all promises for saving order items
        const orderItemsIds = await Promise.all(
            req.body.orderItems.map(async (orderItem) => {
                let newOrderItem = new OrderItem({
                    quantity: orderItem.quantity,
                    product: orderItem.product,
                });

                newOrderItem = await newOrderItem.save();
                return newOrderItem._id; // Return the saved item's _id
            })
        );
        const totalPrices = await Promise.all(orderItemsIds.map(async (orderItemId)=>{
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice
        }))
    
        const totalPrice = totalPrices.reduce((a,b) => a +b , 0);

        // Create a new order with resolved orderItemsIds
        let order = new Order({
            orderItems: orderItemsIds,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
        });

        order = await order.save();

        if (!order) {
            return res.status(404).send('The order cannot be added');
        }

        res.status(201).send(order); // Send the created order
    } catch (err) {
        res.status(500).send({ message: 'An error occurred', error: err.message });
    }
});


Router.get('/:id',async(req,res)=>{
    const order=await Order.findById(req.params.id)
    .populate('user','name')
   
    ;
    if(!order){
        res.status(404).send('no orders');
    }
    else{
        res.status(200).send(order)
    }
});


Router.put('/:ID',async (req,res)=>{
    const order= await Order.findByIdAndUpdate(req.params.ID,{status:req.body.status},{new:true})
    if(!order){
        res.status(404).send('the order cannot be added')
     }
     res.send(order)
})
 
Router.delete('/:ID',(req,res)=>{
    Order.findByIdAndDelete(req.params.ID).then(async order=>{
        if(order)
        {
            await order.orderItems.map(async orderItem=>{
                await OrderItem.findByIdAndDelete(orderItem)
            })
            return res.status(200).json({success:true,
                message:"deleted successfully"
            })
        }
        else {
            return res.status(404).json({
                success:false,
                message:"order not found"
            })
        }
    }).catch(err=>{
        return res.status(400).json({
            success:false
            ,error:err
        })
    })
})

Router.get('/get/totalsales', async (req, res)=> {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
});

Router.get('/get/count',async(req,res)=>{
    const orderList =await Order.find();
    const orderCount=orderList.length;
    if(!orderCount){
        res.status(500).json({success:false});
    }
    else res.send({
        orderCount:orderCount
    })
});


Router.get('/get/userorders:userId',async(req,res)=>{
    const orderList= await Order.find({user:req.params.userId})
    .populate('user','name')
    .populate({path:'orderItems',populate:'product'})
    .sort({'dateOrdered':-1});
    if(!orderList.length){
        res.status(404).send('no orders');
    }
    else{
        res.status(200).send(orderList)
    }
})



module.exports=Router