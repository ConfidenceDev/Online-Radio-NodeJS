const router = require("express").Router()
const { validate, toJSON, music, maintenance } = require("../controllers/admin")

router.post("/validate", (req, res) => {
  validate(req, res)
})

router.post("/download", async (req, res) => {
  toJSON(req, res)
})

router.post("/music", async (req, res) => {
  music(req, res)
})

router.post("/maintenance", (req, res) => {
  maintenance(req, res)
})

module.exports = router
