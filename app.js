const express = require("express");
const { MongoClient,ObjectId } = require('mongodb');
require("dotenv").config();
const router=require('./apis')
const app=express()
var cors = require('cors')
app.use(express.json())
app.use(express.text())
app.use(router)
app.use(cors());
global.mongo_client = {};
try {
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.fn89qwz.mongodb.net/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`
  global.mongo_client = new MongoClient(uri);
  // console.log(uri)
  global.objectID = ObjectId;
  //mongo_client.connect();
  mongo_client.connect((err) => {
    if(err){
      console.log('Connection to Mongodb failed : ', err)
    }else {
      global.db = mongo_client.db(process.env.MONGODB_DB_NAME);
      console.log('Connection to Mongodb : Done')
      app.emit('ready');
    }
  })
} catch (e) {
  console.log(`ERROR::: app.js >>> 14 >>> err `, e);
}
const PORT= process.env.PORT || 3000
app.listen(PORT,console.log(`BACKEND SERVER IS RUNNING ON PORT ${PORT}`))
console.log("please wait till mongodb connection is establish")