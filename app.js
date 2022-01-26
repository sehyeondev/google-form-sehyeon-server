const dotenv = require('dotenv');
dotenv.config();

const http = require('http');


const express = require('express');
const cors = require('cors');
const port = process.env.PORT
// const port = 3000 
const app = express();




app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors({
  origin: '*'
}));

const server = http.createServer(app);
const { Server } = require("socket.io");
// const io = new Server(server);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('a user connected---------');
  //localhost:3000
  // console.log(socket);
  console.log(socket.id);
  socket.on('chat message', (msg) => {    
      io.emit('chat message', {
        msg: msg, 
        senderId: socket.id,
      }); 
      console.log('emitted')  
    
  });
});


app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

// app.use(cors());
app.use('/static', express.static('public')); 

// app.listen(port, () => console.log(`Server up and running on port ${port}.`));

server.listen(3000, () => {
  console.log('listening on *:3000');
});
