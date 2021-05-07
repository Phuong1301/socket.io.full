const express = require("express");
const socket = require("socket.io");
const path=require('path')

const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files
// Static files
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


const io = socket(server);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

Users = [];


io.on('connection', (socket) => {
  console.log('an user connected: ' + socket.id);

  socket.on('disconnect', () => {
    console.log(socket.id + ' user disconnected');
    var user = Users.find(user => user.id == socket.id);
    Users.splice(Users.indexOf(user), 1);
    io.emit('userOnline', Users);
  });

  socket.on('addUser', function(data) {
    if(!(Users.find(user => user.name == data[0]))) {
      console.log( data[0] + " user is login");
      Users.push({name: data[0], id: data[1]});
      socket.emit("addUser", data[0]);
      io.emit("userOnline", Users);
    }

    else {
      socket.emit("error", "this name is extend, please enter other name:")
    }
  });

  socket.on('findUser', function(data) {
    var user = Users.find(user => user.name == data)
    if(!user) {
      socket.emit('notfound', 'the user is not online');
    }
    else {
      socket.emit('found', user);
    }
  });

  socket.on('chat-message', function(data) {
    var sendUser = Users.find(user => user.id == socket.id)
    console.log(sendUser.name +' user send message: ' + data[1] +' to ' + data[0] )
    var user = Users.find(user => user.name == data[0])
    io.to(user.id).emit('chat', [data[1], sendUser.name]);
  });
})


