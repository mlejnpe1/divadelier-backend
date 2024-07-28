const connect = require ("./connect")
const express = require ("express")
const bodyParser = require('body-parser');
const cors = require ("cors")
const bcrypt = require('bcrypt');
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
})