/*const connect = require ("./connect")
const express = require ("express")
const bodyParser = require('body-parser');
const cors = require ("cors")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const events = require("./Routes/eventsRoutes")
const dotenv = require('dotenv');

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(events)

const users = [
    {
      username: 'adela',
      password: bcrypt.hashSync('password123', 10),
    },
  ];

  const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const user = users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
      const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET);
      res.json({ success: true, token: accessToken });
    } else {
      res.json({ success: false });
    }
  });

app.listen(PORT, ()=>{
    connect.connectToServer()
    console.log(`Server is running on port: ${PORT}`);
})*/

const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const cors = require("cors");
const eventsRoutes = express.Router();

const mongoURL = "mongodb+srv://mlejnpe1:PWx09xIuu3qd2JAH@cluster0.tvfgjoc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const PORT = 3001;

const app = express();
app.use(express.json());
app.use(cors());
app.use(eventsRoutes);

const client = new MongoClient(mongoURL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

try {
  client.connect();
  client.db("divadelier-deploy").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
} catch (err){
  console.log(err);
}

const database = client.db("divadelier-deploy");

//Events apis
app.get("/events", async (req, res)=>{
  let data = await database.collection("Events").find({}).toArray();

  if (data.length > 0) {
    res.json(data);
  } else {
    throw new Error("Data was not found.");
  }
})

app.listen(PORT, ()=>{
  console.log("Server is running and listening at port: " + PORT);
})