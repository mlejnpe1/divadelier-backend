const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const cors = require("cors");
const eventsRoutes = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');

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

//Login apis

const users = [
  {
    username: 'adela',
    password: bcrypt.hashSync('password123', 10),
  },
];

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "muj_tajny_token", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    const accessToken = jwt.sign({ username: user.username }, "muj_tajny_token");
    res.json({ success: true, token: accessToken });
  } else {
    res.json({ success: false });
  }
});

//Events apis

//Get all events
app.get("/events", async (req, res)=>{
  let data = await database.collection("Events").find({}).toArray();

  if (data.length > 0) {
    data.sort((a, b) => new Date(b.date) - new Date(a.date))
    res.json(data);
  } else {
    throw new Error("Data was not found.");
  }
})

//add new event
app.post("/events", async (req, res) => {
  let mongoObject = {
    date: req.body.date,
    location: req.body.location,
    info: req.body.info,
  };
  let data = await database.collection("Events").insertOne(mongoObject);

  res.json(data);
});

//delete event
app.delete("/events/:id", async (req, res) => {
  const eventId = new ObjectId(req.params.id);
  try {
    if(database.collection("Events").findOne({_id: eventId})){
      await database.collection("Events").deleteOne({_id: eventId});
      res.json({ message: 'Event deleted' });
    }else{
      console.log("Event not found");
    }
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

app.listen(PORT, ()=>{
  console.log("Server is running and listening at port: " + PORT);
})