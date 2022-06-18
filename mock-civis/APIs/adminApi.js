//create router to handle user api requests
const exp = require('express');
const adminApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");


//import middliware verifytoken(this token keeps the data private and does not call the route until the token is verified)
const verifyToken = require("./middlewares/verifyToken");


//import bcryptjs for password hashing
const bcryptjs = require("bcryptjs");


//import jsonwebtoken to create token 
const jwt = require("jsonwebtoken");
const express = require('express');


//import dotenv file 
require("dotenv").config();


var cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


//configure cloudinary
cloudinary.config({

    //Data stored in in '.env' file 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
})


//config cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req,file) => {
        return {
            folder: "vnr2022",
            public_id: file.fieldname + "-" + Date.now(),
        };
    },
});


//config multer
var upload = multer({ storage: cloudinaryStorage});


//to extract the body of request object
adminApp.use(exp.json())


//USER ROUTES


//Creating user REST API

//create a route to handle '/getusers' path
adminApp.get("/getusers",verifyToken,expressAsyncHandler(async(request,response)=>{

    //let adminCollectionObject
    let adminCollectionObject = request.app.get("adminCollectionObject");

    //get all users
    let users = await adminCollectionObject.find().toArray();

    //send response to admin
    response.send({message:"Users list",payload:users});

}));


//create a route to handle '/login'
adminApp.post("/login",expressAsyncHandler(async(request,response)=>{

     //let adminCollectionObject
     let adminCollectionObject = request.app.get("adminCollectionObject");

     //get user credentials obj from client
     let userCredObj = request.body

     //search for user by username
     let userOfDb = await adminCollectionObject.findOne({username:userCredObj.username});

     //if username not existed 
     if(userOfDb==null){
         response.send({message:"Invalid username"});
     }
     //if username existed 
     else{
         //compare the passwords
         let status = await bcryptjs.compare(userCredObj.password,userOfDb.password);
         //if passwords are matched
         if(status==false){
             response.send({message:"Invalid password"});
         }
         //if passwords are matched
         else{
             //create token 
             let token = jwt.sign({username:userOfDb.username},'abcdef',{expiresIn:30});
             //send token to client
             response.send({message:"success",payload:token,userObj:userOfDb});
         }
     }

}));


//create a route to handle '/createuser'
adminApp.post('/createuser',upload.single("photo"),expressAsyncHandler(async(request,response)=>{

    //get link from cloudinary
    console.log(request.file.path);
    

    //let adminCollectionObject
    let adminCollectionObject = request.app.get("adminCollectionObject");

    //get userObject from client and convert into object
    let newUserObj = JSON.parse(request.body.userObj);

    //search for user by username
    let userOfDb = await adminCollectionObject.findOne({username:newUserObj.username});

    //if user existed 
    if(userOfDb!=null){
        response.send({message:"Username has already taken...Please choose other username"});
    }
    //if user not existed
    else{
        //hash password
        let hashedPassword = await bcryptjs.hash(newUserObj.password,6);
        //replace plain password with hashed password in newUserObject
        newUserObj.password = hashedPassword;
        //add profile image link to newUserObj
        newUserObj.profileImg = request.file.path;
        //insert newUser
        await adminCollectionObject.insertOne(newUserObj);
        //send response to user
        response.send({message:"New user created successfully"});
    }

}));


//create a route to handle '/updateuser'
adminApp.put('/updateuser',expressAsyncHandler(async(request,response)=>{

    //let adminCollectionObject
    let adminCollectionObject = request.app.get("adminCollectionObject");

    //get modified user obj
    let modifiedUser = request.body;

    //update data
    await adminCollectionObject.updateOne({username:modifiedUser.username},{$set:{email:modifiedUser.email,city:modifiedUser.city}});

    //send response
    response.send({messgae:"User details is modified Successfully"});

}));


//create a route to handle '/updatecartdata'
adminApp.put('/updatecartdata',expressAsyncHandler(async(request,response)=>{

    //let adminCollectionObject
    let adminCollectionObject = request.app.get("adminCollectionObject");

    //get modified user obj
    let modifiedUser = request.body;

    //update data
    await adminCollectionObject.updateOne({username:modifiedUser.username},{$set:{productsincart:modifiedUser.productsincart}});

    //send response
    response.send({messgae:"Cart details is Updated Successfully"});

}));



//create a route to handle '/removeuser/:username'
adminApp.delete('/removeuser/:username',expressAsyncHandler(async(request,response)=>{

     //let adminCollectionObject
     let adminCollectionObject = request.app.get("adminCollectionObject");

     //get username from url parameter
    let userName = request.params.username;

    //get user by username
    let user = await adminCollectionObject.findOne({username:userName});

    //if user not existed
    if(user==null){
        response.send({message:"User is not existed"});
    }
    //if user existed
    else{

        await adminCollectionObject.deleteOne({username:userName});
        response.send({messgae:"User Deleted Successfully"});
    }

}));


//private route for testing
adminApp.get('/test',verifyToken,(request,response)=>{
    response.send({message:"This reply is from private route"});
})


//export adminApp
module.exports=adminApp;