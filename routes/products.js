const express =require('express');
const {Product}=require('../models/products');
const controller=require('../controllers/productsControllers');
const mongoose=require('mongoose')
const Router=express.Router();
const multer=require('multer');
const path = require('path');
const fs = require('fs');
const FILE_TYPE_MAP={
  'image/png':'png',
  'image/jpeg':'jpeg',
  'imge/jpg':'jpg'
}

const UPLOAD_DIR = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadErr = new Error('Invalid image type');
    if (isValid) {
      uploadErr = null;
    }
    cb(uploadErr, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});
const uploadOptions=multer({storage:storage});
Router.get('/',controller.getProducts)
Router.post('/',uploadOptions.single('image'),controller.addProduct)
Router.get('/:ID',controller.getOneProduct)
Router.put('/:ID',(req,res)=>{
      Product.findByIdAndUpdate(req.params.ID,{...req.body},{new:true}).then(product=>{
        if(!product){res.status(404).send("invalid object")}
        res.status(200).json(product);}).catch((err)=>{res.status(500).json({error:err})})
})
Router.delete('/:ID',(req,res)=>{
    Product.findByIdAndDelete(req.params.ID).then(product=>{
      if(!product){res.status(404).send("invalid object")}
      else
      res.status(200).json(product);}).catch((err)=>{res.status(500).json({error:err})})
})

Router.put(
  '/gallery-images/:id', 
  uploadOptions.array('images', 10), 
  async (req, res)=> {
      if(!mongoose.isValidObjectId(req.params.id)) {
          return res.status(400).send('Invalid Product Id')
       }
       const files = req.files
       let imagesPaths = [];
       const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

       if(files) {
          files.map(file =>{
              imagesPaths.push(`${basePath}${file.filename}`);
          })
       }

       const product = await Product.findByIdAndUpdate(
          req.params.id,
          {
              images: imagesPaths
          },
          { new: true}
      )

      if(!product)
          return res.status(500).send('the gallery cannot be updated!')

      res.send(product);
  }
)

module.exports=Router;