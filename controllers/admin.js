const fs = require("fs")
const path = require("path")
const {
  passValidation,
  setMaintenance,
  getStore,
  toggleMusic,
} = require("../models/admin")

async function maintenance(req, res) {
  try {
    const pass = req.body.password

    passValidation(pass)
      .then(() => {
        setMaintenance()
          .then((result) => {
            res.status(200).json({
              result,
              success: true,
            })
          })
          .catch((err) => {
            res.status(500).json({
              err,
              success: false,
            })
          })
      })
      .catch((err) => {
        res.status(403).json({
          err,
          success: false,
        })
      })
  } catch (err) {
    console.log(err)
  }
}

async function validate(req, res) {
  try {
    const pass = req.body.password
    passValidation(pass)
      .then(() => {
        res.status(200).json({
          result: "Validated!",
          success: true,
        })
      })
      .catch((err) => {
        res.status(403).json({
          err: err,
          success: false,
        })
      })
  } catch (err) {
    console.log(err)
  }
}

async function toJSON(req, res) {
  try {
    const pass = req.body.password
    passValidation(pass)
      .then(() => {
        getStore()
          .then((result) => {
            res.status(200).json({
              result: result,
              success: true,
            })
          })
          .catch((err) => {
            res.status(500).json({
              err,
              success: false,
            })
          })
      })
      .catch((err) => {
        res.status(403).json({
          err: err,
          success: false,
        })
      })
  } catch (err) {
    console.log(err)
  }
}

async function music(req, res) {
  try {
    const pass = req.body.password
    passValidation(pass)
      .then(() => {
        toggleMusic()
          .then((result) => {
            res.status(200).json({
              msg: "Toggled",
              music: result,
              success: true,
            })
          })
          .catch((err) => {
            res.status(500).json({
              err,
              success: false,
            })
          })
      })
      .catch((err) => {
        res.status(403).json({
          err,
          success: false,
        })
      })
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  validate,
  toJSON,
  music,
  maintenance,
}
