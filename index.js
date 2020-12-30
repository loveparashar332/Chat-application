
const path = require('path')
const express = require('express')
const http = require('http')        // requiring http module
const socketio = require('socket.io')  // server side socket library
const { generateMessage } = require('./utils/messages') // object return 
const { generateLocationMessage } = require('./utils/messages') // object return 
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)   // creating a server outside express lib.i.e we created our own server and config. express app.
const io = socketio(server) // we pass  server to socketi0  .socketio work with raw http server
const Filter = require('bad-words')

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
// let count = 0

//server(emit)->client(recieve) - updatecount
//client(emit)->server(recieve) - increment
//disconnect ,and connection are inbuuilt event listner
io.on('connection',(socket)=>{    // setting up an event .. socket is an object that contains info. about  event here it is connection and we can use method on it
    console.log('New WebSocket connection')
   
    socket.on('join',(options,callback)=>{   // when someone joins room from client we get his name,room
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)  // join is use to join  the room 
        socket.emit('message', generateMessage('Admin!','Welcome!'))  // sending welcome text to function and getting object in return and then sending that object to client
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined`))   // every one gets this message except the user itself
                           // to is used to send the msg to particular room only and not to every one
                           io.to(user.room).emit('roomData', {     //when someones join room we send room ,and users list from it toclient
                            room: user.room,
                            users: getUsersInRoom(user.room)
                        });
                        callback()
    })
    socket.on('sendMessage', (message, callback) => {  // this call back is for acknowledgement that server has recieved msg from client
        const filter = new Filter()
        const user = getUser(socket.id)
        if (filter.isProfane(message)) {   // isf msg is not good i.e bad then it will not be sent
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('message', generateMessage(user.username,message)) // message goes to that room only and not to other
        callback()
    })
    socket.on('sendLocation', (coords,callback) => {   // listen to the event sendlocation 
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))  //sending location link to every client from server
        callback()  // acknowledge msg
    })   
    socket.on('disconnect',()=>{  // when someone disconnects every one get this msg
        const user = removeUser(socket.id)  //removing from room
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left!`))
            io.to(user.room).emit('roomData', {    // send room data to client and user list when someine disconnects
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
       // io.emit('message',generateMessage('user has left'))
    })



    // socket.emit('updatedcount',count)  // emit the event and sending the count to client side 

    // socket.on('increment',()=>{  // recieve increment event from client and send the incremented value of count
    //     count++
    // //    socket.emit('updatedcount',count)  // socket.emit send count to only a single connecttion which is connected 
    //     io.emit('updatedcount',count)  // io.emit send count to every connection connected 
    // })

})
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
});