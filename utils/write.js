const fs = require("fs")

async function write(path, file) {
  try {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(file), "utf8", (err) => {
        if (!err) {
          resolve()
        } else {
          reject(err)
        }
      })
    })
  } catch (error) {
    console.log(error)
  }
}

function getRandom() {
  let text = "VEBBO "
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (let i = 0; i < 16; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}

module.exports = {
  write,
  getRandom,
}
