const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const { istring } = require('./utils/validation');
const { Users } = require('./utils/users');
var users = new Users();
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (param, callback) => {
        //checking the string or not
        if (!istring(param.name) || !istring(param.room)) {
            return callback('Please enter name and room name \n No empty value');
        }
        socket.join(param.room);
        users.removeuser(socket.id); //removing previous users with same id
        users.adduser(socket.id, param.name, param.room); //then adding to our user list
        //socket.leave('room name');
        io.to(param.room).emit('updateUserList', users.getuserlist(param.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(param.room).emit('newMessage', generateMessage('Admin', `${param.name} joined`));
        callback();
    });



    // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    //on create new message which is emitted on click we broadcast newmsg
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        var user = users.getuser(socket.id);
        // if (user /*&& istring(message.text)*/ ) {
        //to send messages within private room
        if (user) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }


        callback();
        // socket.broadcast.emit('newMessage', {
        //   from: message.from,
        //   text: message.text,
        //   createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        var user = users.removeuser(socket.id);
        //if removed a user from list
        if (user) {
            io.to(user.room).emit('updateUserList', users.getuserlist(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left}`));
        }
    });
});



server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});