const http = require('http')
const express = require('express')
const app = express()
const socketio = require('socket.io')

const server = http.createServer(app)
const io = socketio(server)
const port=process.env.PORT ||3344

let users = {
  arnav: 'agag123',
}
let socketMap = {}

io.on('connection', (socket) => {
  console.log('connected with socket id =', socket.id)

  function login(s, u) {
    s.join(u)
    s.emit('logged_in')
    socketMap[s.id] = u
    console.log(socketMap)
  }

  socket.on('login', (data) => {
    if (users[data.username]) {
      if (users[data.username] == data.password) {
        login(socket, data.username)
      } else {
        socket.emit('login_failed')
      }
    } else {
      users[data.username] = data.password
      login(socket, data.username)
    }
  })

  socket.on('msg_send', (data) => {
    data.from = socketMap[socket.id]
    if (data.to) {
      io.to(data.to).emit('msg_rcvd', data)
    } else {
      io.emit('msg_rcvd', data)
    }
  })
})
 console.log("HIMANSHU SINGH");
  
app.use('/', express.static(__dirname + '/public'))

server.listen(port, () => {
  console.log('Started on 3344')
})
