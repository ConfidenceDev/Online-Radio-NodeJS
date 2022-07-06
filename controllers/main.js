const {
  getStreamer,
  writeStreamer,
  removeStreamer,
  setLive,
  getLive,
  checkStore,
  addToStore,
  removeFromStore,
  getMaintenance,
  getToggle,
  setToggle,
} = require("../models/main")

function main(io) {
  io.on("connection", (socket) => {
    const value = "560"
    const loop = 1000
    let counter
    let duration = 0
    clearBuffer()

    //============= ONLINE ====================
    let count = io.sockets.server.engine.clientsCount
    io.emit("online", count)

    getMaintenance().then(async (result) => {
      if (result) {
        socket.emit("maintained", result)
      }
    })

    getStreamer().then(async (result) => {
      if (result) {
        socket.emit("live", result)
      }
    })

    getToggle().then(async (result) => {
      if (result) {
        socket.emit("music", result)
      }
    })

    //============= STREAM =====================
    socket.on("stream", async (data) => {
      clearBuffer()
      if (!(await getLive())) {
        if (
          data.selected === "10" ||
          data.selected === "20" ||
          data.selected === "30"
        ) {
          checkStore(data.token).then((result) => {
            if (result) {
              stream(data)
            } else {
              const doc = {
                busy: true,
                wrong: true,
                msg: "Token is invalid",
              }
              socket.emit("stream", doc)
            }
          })
        } else {
          stream(data)
        }

        return
      } else {
        const doc = {
          busy: true,
          wrong: false,
          msg: "Someone is streaming",
        }
        socket.emit("stream", doc)
        return
      }
    })

    //============= Audio =====================
    socket.on("audio", async (data) => {
      clearBuffer()
      if (duration > 0) {
        await socket.broadcast.volatile.emit("audio", data)
      }
    })

    socket.on("music", async (data) => {
      io.emit("music", await getToggle())
    })

    //============= STREAM =====================
    socket.on("message", (data) => {
      io.emit("message", data)
    })

    //============= STORE ====================
    socket.on("store", async (data) => {
      clearBuffer()
      await addToStore(data)
    })

    //============= VALUE =======================
    io.emit("value", value)

    //============= LIVE ====================

    function startLive() {
      counter = setInterval(async () => {
        if (duration > 0) {
          clearBuffer()
          await io.volatile.emit("timer", --duration)

          if (duration <= 0) {
            await setLive(false)
            getStreamer().then(async (result) => {
              const obj = {
                isLive: false,
                userId: result.userId,
              }

              io.emit("live", obj)
              await removeStreamer()

              duration = 0
              clearInterval(counter)
            })
          }
        }
      }, loop)
    }

    async function stream(data) {
      await writeStreamer(data)
      await setToggle()

      data.busy = false
      data.isLive = true
      switch (data.selected) {
        case "10":
          duration = 600
          break
        case "20":
          duration = 1200
          break
        case "30":
          duration = 1800
          break
        default:
          duration = 300
          break
      }

      await removeFromStore(data.token)
      await setLive(true)
      io.emit("music", await getToggle())
      io.to(data.userId).emit("stream", data)
      socket.broadcast.emit("live", data)
      startLive()
    }

    function clearBuffer() {
      socket.sendBuffer = []
    }

    //============= DISCONNECT =================
    socket.on("disconnect", () => {
      let count = io.sockets.server.engine.clientsCount
      io.emit("online", count)
    })
  })
}

module.exports = { main }
