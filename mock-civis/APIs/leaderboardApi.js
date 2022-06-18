const exp = require('express');
const leaderboardApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');

//to extract the body of request object
leaderboardApp(exp.json())

//creating product REST API

//create a route to handle '/getproducts'
leaderboardApp.get('/getproducts',expressAsyncHandler(async(request,response)=>{

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


//export adminApp
module.exports=leaderboardApp;
