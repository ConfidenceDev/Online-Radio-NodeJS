const http = require("http")
const path = require("path")
const express = require("express")
require("dotenv").config()
const { corsHeader } = require("./cors/cors")

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5050

const io = require("socket.io").listen(server, {
  wsEngine: "ws",
  pingTimeout: 5000,
  pingInterval: 10000,
  cors: corsHeader,
})

const { main } = require("./controllers/main")
const adminRoute = require("./routes/admin")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(corsHeader)
app.use(adminRoute)
app.use(express.static(path.join(__dirname, "views/public")))
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

main(io)
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
