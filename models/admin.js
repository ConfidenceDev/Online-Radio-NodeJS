const { write } = require("../utils/write")
const Store = require("../data/store.json")
let Maintenance = require("../data/maintenance.json")
const mPath = "./data/maintenance.json"

async function passValidation(pass) {
  try {
    return new Promise((resolve, reject) => {
      if (
        pass !== undefined &&
        pass !== null &&
        pass === process.env.ADMIN_PASS
      ) {
        resolve()
      } else {
        reject("Password is incorrect!")
      }
    })
  } catch (error) {
    console.log(error)
  }
}

async function setMaintenance() {
  return new Promise((resolve, reject) => {
    if (Maintenance[0]) {
      const isMaintained = Maintenance[0].maintained
      if (isMaintained) {
        Maintenance[0].maintained = false
        write(mPath, Maintenance)
        resolve(Maintenance[0].maintained)
      } else {
        Maintenance[0].maintained = true
        write(mPath, Maintenance)
        resolve(Maintenance[0].maintained)
      }
    } else {
      reject("No value for maintenance")
    }
  })
}

async function getStore() {
  return new Promise((resolve, reject) => {
    resolve(Store)
  })
}

async function toggleMusic() {
  return new Promise((resolve, reject) => {
    if (Maintenance[1]) {
      const toggled = Maintenance[1].toggle
      if (toggled) {
        Maintenance[1].toggle = false
        write(mPath, Maintenance)
        resolve(Maintenance[1].toggle)
      } else {
        Maintenance[1].toggle = true
        write(mPath, Maintenance)
        resolve(Maintenance[1].toggle)
      }
    } else {
      reject("No value for music")
    }
  })
}

module.exports = {
  passValidation,
  setMaintenance,
  getStore,
  toggleMusic,
}
