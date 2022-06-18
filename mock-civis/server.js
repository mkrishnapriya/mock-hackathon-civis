//creating the express app
const exp = require("express");
const res = ("express/lib/response");
const app = exp();
const mclient = require("mongodb").MongoClient;


//import path module
const path = require('path');


//connect build of react app ith nodejs
app.use(exp.static(path.join(__dirname,'./build')));


//Extracting body of request object
app.use(exp.json());


//DB Connection URL
const DBurl = "mongodb+srv://vnr2022:vnr2022@back-end-cluster.yameo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


//connect with mongodb server
mclient.connect(DBurl)
.then((client)=>{

    //get DB object
    let dbObj = client.db("mockcivis");

    //create collection objects
    let userCollectionObject = dbObj.collection("useraccounts");
    let adminCollectionObject = dbObj.collection("adminaccounts");
    let consultaionsCollectionObject = dbObj.collection("consultaions");
    // let leaderboardCollectionObject = dbObj.collection("leaderboard");

    //sharing collection object to APIs
    app.set("userCollectionObject",userCollectionObject);
    app.set("adminCollectionObject",adminCollectionObject);
    app.set("consultaionsCollectionObject",consultaionsCollectionObject);
    // app.set("leaderboardColectionObject",leaderboardCollectionObject);

    console.log("DB connection is success");

})
.catch(err=>console.log("Error in DB connection",err))


//import userApp and productApp
const userApp = require('./APIS/userApi');
const consultaionsApp = require('./APIs/consultaionsApi');
const adminApp  = require('./APIs/adminApi');
// const leaderboardApp = require('./APIs/leaderboardApi');


//create specific middleware based on path
app.use('/user-api',userApp)//so when we get user-api name then it calls userApp and goes into that file
app.use('/consultaions-api',consultaionsApp)
app.use('/admin-api',adminApp)
// app.use('/leaderboard-api',leaderboardApp)


//dealing with page refresh
app.use('*',(request,response)=>{
    response.sendFile(path.join(__dirname,'./build/index.html'));
});

//Handling invalid paths middleware
app.use((request,response,next)=>{
    response.send({message:`path ${request.url} is invalid`});
});

//Error Handling middleware
app.use((error,request,response,next)=>{
    response.send({message:"Error Occured",reason:`${error.message}`})
});

//Assigning port number
app.listen(8000,()=>console.log('Server listening on port 8000...'));