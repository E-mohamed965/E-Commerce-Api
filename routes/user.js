const express=require('express');
const {User}=require('../models/user');
const Router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
Router.get('/',async (req,res)=>{
    const userList=await User.find().select('name email phone isAdmein');
    if(!userList){
        res.status(505).json({success:true});
    }
    else res.send(userList);
});
Router.post('/',async (req,res)=>{
    let user=new User({
      passwordHash:bcrypt.hashSync(req.body.password,10),
      ...req.body
    })
    user=await user.save();
    if(!user)res.status(505).send('user cannot be created');

    res.send(user);
});
Router.post('/register',async (req,res)=>{
      let user=new User({
        passwordHash:bcrypt.hashSync(req.body.password,10),
        ...req.body
      })
      user=await user.save();
      if(!user)res.status(505).send('user cannot be created');

      res.send(user);
});

Router.get('/:id',async(req,res)=>{
    const user=await User.findById(req.params.id).select('name email phone isAdmein');
    if(!user){
        res.status(505).json({success:false});
    }
    else res.send(user);
})

Router.post('/login',async (req,res)=>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(400).send('user not found');
    }
    else{
        if(user&&bcrypt.compareSync(req.body.password, user.passwordHash))
        {
            const token= jwt.sign({
                userId:user.id,
                isAdmin:user.isAdmin 
            },
            process.env.secret,
            {
                expiresIn:'1d'
            }
        )
        const decoded = jwt.decode(token);
console.log(decoded); // Check the decoded token to see the payload

            return res.status(200).send({
                user:user.email,
                token:token
            });
        }
    else
    return res.status(400).send('password is wrong')
    }
})

Router.get('/get/count',async(req,res)=>{
    const userList =await User.find();
    const userCount=userList.length;
    if(!userCount){
        res.status(500).json({success:false});
    }
    else res.send({
        userCount:userCount
    })
})


Router.delete('/:ID',(req,res)=>{
    User.findByIdAndDelete(req.params.ID).then(user=>{
        if(user)
        {
            return res.status(200).json({success:true,
                message:"deleted successfully"
            })
        }
        else {
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
    }).catch(err=>{
        return res.status(400).json({
            success:false
            ,error:err
        })
    })
})

module.exports=Router