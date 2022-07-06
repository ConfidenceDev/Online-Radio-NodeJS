const { write } = require("../utils/write")
const Live = require("../data/live.json")
let Maintenance = require("../data/maintenance.json")
let Streamer = require("../data/streamer.json")
let Store = require("../data/store.json")

const sPath = "./data/streamer.json"
const lPath = "./data/live.json"
const stPath = "./data/store.json"
const mPath = "./data/maintenance.json"

// =================== Streamer ======================

async function getStreamer() {
  return new Promise((resolve) => {
    resolve(Streamer[0])
  })
}

async function writeStreamer(obj) {
  return new Promise((resolve) => {
    Streamer[0] = obj
    write(sPath, Streamer)
    resolve(obj)
  })
}

async function removeStreamer() {
  try {
    return new Promise((resolve) => {
      Streamer = []
      write(sPath, Streamer)
      resolve()
    })
  } catch (error) {
    console.log(error)
  }
}

// =================== Live ======================

async function getLive() {
  return new Promise((resolve) => {
    resolve(Live[0].isLive)
  })
}

async function setLive(bol) {
  return new Promise((resolve) => {
    Live[0].isLive = bol

    write(lPath, Live)
    resolve()
  })
}

// =================== Store ======================
async function checkStore(obj) {
  return new Promise((resolve) => {
    resolve(Store.find((s) => s.token === obj))
  })
}

async function addToStore(obj) {
  return new Promise((resolve) => {
    Store.push(obj)
    write(stPath, Store)
    resolve()
  })
}

async function removeFromStore(obj) {
  return new Promise((resolve) => {
    const st = Store.filter((item) => item.token !== obj)
    write(stPath, st)
    resolve()
  })
}

// =================== Maintenance ======================
async function getMaintenance() {
  return new Promise((resolve) => {
    resolve(Maintenance[0].maintained)
  })
}

// =================== Music ======================
async function getToggle() {
  return new Promise((resolve) => {
    resolve(Maintenance[1].toggle)
  })
}

async function setToggle() {
  return new Promise((resolve) => {
    if (Maintenance[1]) {
      const toggled = Maintenance[1].toggle
      if (toggled) {
        Maintenance[1].toggle = false
        write(mPath, Maintenance)
      }

      resolve()
    }
  })
}

module.exports = {
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
}
