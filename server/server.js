const express = require('express');
const socket = require('socket.io');

const http = require('http');
const router = require('./router');
const cors = require('cors');

const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const  io= socket(server,{
    cors: {
        origin: ["http://localhost:3000"],
    }
});

app.use(cors);
app.use(router);

io.on('connection', (socket) => {
    console.log("We have a new Connection");

    socket.on('join', (joinInfo, callback) => {
        const {error, user} = addUser({id: socket.id, name:joinInfo.name, room:joinInfo.room});
        if(error){
            return callback(error);
        }

        // emit -> emitting an event from the backend to the front end
        // on -> listening for an event from the frontend to the backend

        socket.emit('message', {user: 'admin', text: `${user.name}, welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined `});

        socket.join(user.room);

        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});
        callback();
    });
    
    
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', {user: user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});

        callback();
    })


    socket.on('disconnect', ()  => {
        console.log("User has left");
        const user = removeUser(socket.id);
        if(user){
            socket.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left`});
        }
    });
});


server.listen(PORT, () => {
    console.log(`On PORT ${PORT}`);
})