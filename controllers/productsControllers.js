const express= require('express');
const app=express();
require('dotenv/config');
const multer= require('multer');

const {Product}=require('../models/products');
const { Category } = require('../models/category');
const addProduct=async(req,res)=>{
      const category=await Category.findById(req.body.category);
      const file=req.file;
      if(!category){
        res.status(404).json({message:"invalid category"})
      }
      else if(!file){
        res.status(404).json({message:"no image uploaded"})
      }
      else{
        const fileName=req.file.filename;
        const pasePath=`${req.protocol}://${req.get('host')}/public/upload/`
    const product=new Product({
      image:`${pasePath}${fileName}`,
  ...req.body
    })
    product.save().then((product=>{res.status(200).json(product)}))
    .catch((err)=>{res.json({
          error:err
    })});}
    
};
const getProducts=async (req,res)=>{
    let filter={};
    if(req.query.categories){
        filter={category:req.query.categories.split(',')};
    }
    const productList=await Product.find(filter).populate('category').select('description category -_id')  .lean();;
    res.send(productList);
};
const getOneProduct= (req,res)=>{
     Product.findById(req.params.ID).then(product=>{
      res.status(200).send(product);
     }).catch((err)=>{
      res.json({
        error:err
      })
     });
    
}
module.exports={
    getProducts,
    addProduct,
    getOneProduct
}