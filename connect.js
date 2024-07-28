/*
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mlejnpe1:PWx09xIuu3qd2JAH@cluster0.tvfgjoc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("test").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run();

let database;

module.exports={
  connectToServer: ()=>{
    database = client.db("divadelier-deploy");
},
getDb: ()=>{
    return database;
}
}

/*const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path:"./config.env"});

const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v2,
    strict: true,
    deprecationErrors: true,
  }
});

let database

module.exports = {
    connectToServer: ()=>{
        database = client.db("divadelier-deploy")
    },
    getDb: ()=>{
        return database
    }
}*/

// connect.js
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb+srv://mlejnpe1:PWx09xIuu3qd2JAH@cluster0.tvfgjoc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB server URL

// Database Name
const dbName = 'divadelier-deploy'; // Replace with your database name

// Create a new MongoClient
const client = new MongoClient(url);

async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to server');

    // Connect to the database
    const db = client.db(dbName);
    return { db, client };
  } catch (err) {
    console.error('Connection error', err);
    throw err;
  }
}

module.exports = connectToDatabase;


