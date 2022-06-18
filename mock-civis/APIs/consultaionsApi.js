const exp = require('express');
const consultaionsApp  = exp.Router();
const expressAsyncHandler = require('express-async-handler');


//to extract the body of request object
consultaionsApp.use(exp.json())


//creating product REST API

//create a route to handle '/getproducts'
consultaionsApp.get('/getproducts',expressAsyncHandler(async(request,response)=>{

    //get productCollectionObject
    let consultaionsCollectionObject = request.app.get("consultaionsCollectionObject");

    //read allproducts 
    let consultaion = await consultaionsCollectionObject.find().toArray()

    //check if no products are present in the collection
    if(consultaion.length==0){
        response.send({message:"No products to show"})
    }
    //if products present in the collection
    else{
        response.send({message:"All products",payload:consultaion});
    }

}));


//create a route to handle a specific product '/getproduct/id'
consultaionsApp.get('/getproduct/:id',expressAsyncHandler(async(request,response)=>{
    
    //get productCollectionObject
    let consultaionsCollectionObject = request.app.get("consultaionsCollectionObject");
    
    //get productId from url parameter
    let pid = (+request.params.id);
    
    //get product by id
    let consultaion = await consultaionsCollectionObject.findOne({productId:pid});

    //if product not existed
    if(consultaion==null){
        response.send({message:"Product is not existed"});
    }
    //if product existed
    else{
        response.send({messgae:"Product existed",payload:consultaion});
    }

}));


//create a route to handle '/createproduct'
consultaionsApp.post('/createproduct',expressAsyncHandler(async(request,response)=>{
    
    //get productCollectionObject
    let consultaionsCollectionObject = request.app.get("consultaionsCollectionObject");

    //get product obj from req
    let consultaionObj = request.body

    //insert productObj
    let result = await productCollectionObject.insertOne(consultaionObj);

    //send respone
    response.send({message:"product created successfully"});

}));


//create a route to handle '/uodateproduct'
consultaionsApp.put('/updateproduct',expressAsyncHandler(async(request,response)=>{
    
    //get productCollectionObject
    let consultaionsCollectionObject = request.app.get("consultaionsCollectionObject");

    //get modified product obj
    let modifiedProduct = request.body;

    //update data
    await consultaionsCollectionObject.updateOne({productId:modifiedProduct.productId},{$set:{...modifiedProduct}});

    //send response
    response.send({messgae:"Product details is modified Successfully"});

}));


//create a route to handle '/removeproduct/id'
consultaionsApp.delete('/removeproduct/:id',expressAsyncHandler(async(request,response)=>{

    //get productCollectionObject
    let consultaionsCollectionObject = request.app.get("consultaionsCollectionObject");

    //get productId from url parameter
    let pid = (+request.params.id);

    //get product by id
    let product = await consultaionsCollectionObject.findOne({productId:pid});

    //if product not existed
    if(product==null){
        response.send({message:"Product is not existed"});
    }
    //if product existed
    else{

        await consultaionsCollectionObject.deleteOne({productId:pid});
        response.send({messgae:"Product Deleted Successfully"});
    }

}));


//export productApp
module.exports=consultaionsApp;