const passField = document.getElementById("pass_field")
const btns = document.querySelector(".btns")
const validation = document.querySelector(".validation")
const passBtn = document.querySelector("#passBtn")
const downloadBtn = document.getElementById("download")
const musicBtn = document.getElementById("music")
const maintenanceBtn = document.getElementById("maintain")

const url = "https://vebbo-community.herokuapp.com"
const socket = io("https://vebbo-community.herokuapp.com/", { secure: true })

//const url = "http://localhost:5050"
//const socket = io("http://localhost:5050")

passBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const content = passField.value
  if (content === undefined || content === null || content === "") {
    alert("Field is empty!")
    return
  }

  const doc = {
    password: content,
  }

  fetch(`${url}/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        btns.style = "display: flex;"
        validation.style = "display: none;"
        passField.disabled = true
      } else {
        alert("Wrong Password!")
      }
    })
    .catch((err) => {
      console.log(err)
    })
})

maintenanceBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const content = passField.value

  const doc = {
    password: content,
  }

  fetch(`${url}/maintenance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      alert(`Maintained: ${result.result}`)
    })
    .catch((err) => {
      console.log(err)
    })
})

music.addEventListener("click", (e) => {
  e.preventDefault()
  const content = passField.value

  const doc = {
    password: content,
  }

  fetch(`${url}/music`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      socket.emit("music", result)
      alert(`Music: ${result.music}`)
    })
    .catch((err) => {
      console.log(err)
    })
})

downloadBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const password = passField.value
  const doc = {
    password: password,
  }

  fetch(`${url}/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(doc),
  })
    .then((response) => response.json())
    .then((result) => {
      const link = document.createElement("a")
      const file = new Blob([JSON.stringify(result.result)], {
        type: "text/plain",
      })
      link.href = URL.createObjectURL(file)
      link.download = "tokens.json"
      link.click()
    })
    .catch((err) => {
      console.log(err)
    })
})
