const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const port = 3000

app.set('port', 3000)

const io = require('socket.io')(server)

// Static folder setup
app.use(express.static(path.join(__dirname,'/build')))

app.get('/', (req, res) => {
  res.render('build/index.html', {})
})

// app.get('/login', (req, res) => {
//   res.render('login.html', {})
// })

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})