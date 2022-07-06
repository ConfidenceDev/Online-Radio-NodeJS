let streamerDoc = null
let buf
let isLive = false
let pos = 0
let flagUTC = []
let img = localStorage.getItem("image")
let userName, locate, bio, facebook, instagram, twitter, website
let opt1 = null,
  opt2 = null,
  opt3 = null
let isMute = true
let selected = null
let naira = "560"
let pVal = 0
let parser = null
let isMaintained = false
const audio = document.createElement("audio")
audio.setAttribute("src", "./assets/storage/Yanni - In the morning light.mp3")
audio.setAttribute("type", "audio/mp3")
audio.setAttribute("loop", true)

opt1 = localStorage.getItem("opt1") ? localStorage.getItem("opt1") : null
opt2 = localStorage.getItem("opt2") ? localStorage.getItem("opt2") : null
opt3 = localStorage.getItem("opt3") ? localStorage.getItem("opt3") : null

if (opt1 != null) {
  const items = selectDiv.children
  items[1].children[0].children[1].src = `./assets/icons/unlock.png`
}
if (opt2 != null) {
  const items = selectDiv.children
  items[2].children[0].children[1].src = `./assets/icons/unlock.png`
}
if (opt3 != null) {
  const items = selectDiv.children
  items[3].children[0].children[1].src = `./assets/icons/unlock.png`
}

if (img > 0 && img != null && img != undefined) {
  profileImgBtn.src = `./assets/icons/mood_${localStorage.getItem("image")}.png`
  avatarList.children[localStorage.getItem("image") - 1].style = "opacity: .4"

  usernameField.value = localStorage.getItem("username")
  locationField.value = localStorage.getItem("location")
  facebookField.value = localStorage.getItem("facebook")
  instaField.value = localStorage.getItem("instagram")
  twitField.value = localStorage.getItem("twitter")
  webField.value = localStorage.getItem("website")
  bioField.value = localStorage.getItem("bio")
  flagUTC[0] = localStorage.getItem("flagUTC")

  userName = localStorage.getItem("username")
    ? localStorage.getItem("username")
    : ""
  locate = localStorage.getItem("location")
    ? localStorage.getItem("location")
    : ""
  bio = localStorage.getItem("bio") ? localStorage.getItem("bio") : ""
  facebook = localStorage.getItem("facebook")
    ? localStorage.getItem("facebook")
    : ""
  instagram = localStorage.getItem("instagram")
    ? localStorage.getItem("instagram")
    : ""
  twitter = localStorage.getItem("twitter")
    ? localStorage.getItem("twitter")
    : ""
  website = localStorage.getItem("website")
    ? localStorage.getItem("website")
    : ""
  pos = localStorage.getItem("image")
}

avatarList.addEventListener("click", (e) => {
  e.preventDefault()
  const items = avatarList.children
  const targetElement = e.target || e.srcElement
  const src = targetElement.getAttribute("src")
  const item = src.split("_")
  pos = item[1].split(".")[0]

  for (let i = 0; i < items.length; i++) {
    const item = items[i].currentSrc.split("_")
    const curPos = item[1].split(".")
    items[i].style = "opacity: 1"
  }
  targetElement.style = "opacity: .4"
  profileImgBtn.src = `./assets/icons/mood_${pos}.png`
})

bioField.addEventListener("keyup", () => {
  bioCount.innerText = `${bioField.value.length}/32`
})

saveBtn.addEventListener("click", (e) => {
  const uVal = usernameField.value ? usernameField.value : ""
  const lVal = locationField.value ? locationField.value : ""
  const fVal = facebookField.value ? facebookField.value : ""
  const iVal = instaField.value ? instaField.value : ""
  const tVal = twitField.value ? twitField.value : ""
  const wVal = webField.value ? webField.value : ""
  const bVal = bioField.value ? bioField.value : ""

  if (pos === 0 || uVal === "") {
    showMsg("Enter a Username and Select an Avatar")
    return
  }

  img = pos
  userName = uVal
  locate = lVal
  facebook = fVal
  instagram = iVal
  twitter = tVal
  website = wVal
  bio = bVal

  localStorage.setItem("image", pos)
  localStorage.setItem("username", uVal)
  localStorage.setItem("location", lVal)
  localStorage.setItem("facebook", fVal)
  localStorage.setItem("instagram", iVal)
  localStorage.setItem("twitter", tVal)
  localStorage.setItem("website", wVal)
  localStorage.setItem("bio", bVal)

  if (context !== undefined && context.state !== "running") {
    context.resume()
  }
})

selectDiv.addEventListener("click", (e) => {
  e.preventDefault()
  clearSelected()
  const targetElement = e.target || e.srcElement
  if (targetElement.nodeName !== "DIV") {
    selected = targetElement.innerText.split(" ")[0]
    targetElement.parentNode.style = "background-color: rgba(0, 0, 0, 0.26);"
  }

  if (selected === "5") {
    amt.innerText = "Free"
  } else if (selected === "10" && opt1 == null) {
    amt.innerText = "$2.99"
  } else if (selected === "20" && opt2 == null) {
    amt.innerText = "$4.99"
  } else if (selected === "30" && opt3 == null) {
    amt.innerText = "$6.99"
  }
})

function clearSelected() {
  selected = null
  const items = selectDiv.children
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items[i].children.length; j++) {
      items[i].children[j].style = "background-color: transparent;"
    }
  }
}

socket.on("connect", () => {
  socket.sendBuffer = []
})

socket.on("reconnect", () => {
  socket.sendBuffer = []
})

socket.on("online", (data) => {
  count.innerText = toComma(data)
})

socket.on("values", (data) => {
  naira = data
})

socket.on("maintained", (data) => {
  isMaintained = data
})

socket.on("music", async (data) => {
  if (data) {
    audio.play()
    showMusicWave()
  } else {
    audio.pause()
    stopMusicWave()
  }
})

async function showMusicWave() {
  if (audioPreprocessNode !== undefined && audioPreprocessNode != null) {
    audioPreprocessNode.addEventListener("audioprocess", packetWave)
  }
}

async function stopMusicWave() {
  if (audioPreprocessNode !== undefined && audioPreprocessNode != null) {
    audioPreprocessNode.removeEventListener("audioprocess", packetWave)
  }
}

socket.on("audio", async (data) => {
  await audioStream(data)
})

socket.on("message", (data) => {
  let li = document.createElement("li")
  let last = chatList.children[chatList.children.length - 1]

  addChat(data, li)
  chatList.scrollTop = chatList.scrollHeight
})

function addChat(data, li) {
  if (data.comment !== null) {
    li.innerHTML = `<div class="msg_item">
        <img src="./assets/icons/mood_${
          data.data.image + 1
        }.png" class="li_profile" id="li_profile">
          <div class="content_container">
              <label class="username">${data.data.userName}</label>
              <label class="date">${data.utc}</label>
              <label class="content">${data.comment}</label>
              <div style="display: none"> 
                <label class="content">${data.data.location}</label>
                <label class="content">${data.data.bio}</label>
                <label class="content">${data.data.facebook}</label>
                <label class="content">${data.data.instagram}</label>
                <label class="content">${data.data.twitter}</label>
                <label class="content">${data.data.website}</label>
              </div>
              <hr class="item_divider">
          </div>
          </div>`

    chatList.appendChild(li)
  }
}

chatList.addEventListener("click", (e) => {
  if (e.target && e.target.nodeName == "IMG") {
    const src = e.target.parentNode.children[0].getAttribute("src")
    const item = src.split("_")
    let image = item[1].split(".")[0]

    const userName = e.target.parentNode.children[1].children[0].innerText
    const location =
      e.target.parentNode.children[1].children[3].children[0].innerText
    const bio =
      e.target.parentNode.children[1].children[3].children[1].innerText
    const facebook =
      e.target.parentNode.children[1].children[3].children[2].innerText
    const instagram =
      e.target.parentNode.children[1].children[3].children[3].innerText
    const twitter =
      e.target.parentNode.children[1].children[3].children[4].innerText
    const website =
      e.target.parentNode.children[1].children[3].children[5].innerText

    setProfile(
      --image,
      userName,
      location,
      bio,
      facebook,
      instagram,
      twitter,
      website
    )

    loadModal("popup_profile")
  }
})

function setProfile(img, userName, location, bio, face, insta, twit, web) {
  profileImg.src = `./assets/icons/mood_${++img}.png`
  profileName.innerText = userName
  profileLocation.innerText = location
  profileBio.innerText = bio
  profileFace.href = `https://web.facebook.com/${face}`
  profileInsta.href = `https://www.instagram.com/${insta}`
  profileTwit.href = `https://twitter.com/${twit}`

  if (web.startsWith("http")) {
    profileWeb.href = web
  } else {
    profileWeb.href = `http://${web}`
  }
}

sendBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (img !== 0 && img != null && img != undefined) {
    if (chatField.value !== null && chatField.value !== "") {
      if (isMaintained) {
        showMsg("We are currently in maintainance, we'll be back shortly")
        return
      }

      const doc = {
        utc: new Date().toUTCString(),
        comment: chatField.value,
        platform: "web",
        data: {
          userName: userName,
          image: pos - 1,
          location: locate,
          bio: bio,
          facebook: facebook,
          instagram: instagram,
          twitter: twitter,
          website: website,
        },
      }

      socket.emit("message", doc)
      chatField.value = null
    }
  } else {
    showMsg("Set up a profile first, click the circle button at the top")
  }
})

chatField.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault()
    sendBtn.click()
  }
})

socket.on("timer", (data) => {
  let minutes = parseInt(data / 60, 10)
  let seconds = parseInt(data % 60, 10)

  minutes = minutes < 10 ? "0" + minutes : minutes
  seconds = seconds < 10 ? "0" + seconds : seconds

  timer.innerText = `${minutes}:${seconds}`
})

socket.on("live", (data) => {
  if (data.isLive) {
    streamerDoc = data.data.data
    streamerBtn.src = `./assets/icons/mood_${streamerDoc.image + 1}.png`
  } else {
    streamerDoc = null
    streamerBtn.src = `./assets/icons/circle.png`
    if (data.userId === socket.id) {
      isLive = false
      socket.emit("end", socket.id)
      goLive.innerText = "Stream"
      goLive.style = "background-color: var(--secondary-color);"
      clearSelected()
      if (audioPreprocessNode !== undefined && audioPreprocessNode != null) {
        audioPreprocessNode.removeEventListener("audioprocess", packetStream)
      }
    }
  }
})

streamerBtn.addEventListener("click", (e) => {
  e.preventDefault()
  setProfile(
    streamerDoc.image,
    streamerDoc.userName,
    streamerDoc.location,
    streamerDoc.bio,
    streamerDoc.facebook,
    streamerDoc.instagram,
    streamerDoc.twitter,
    streamerDoc.website
  )

  loadModal("popup_profile")
})

goLive.addEventListener("click", (e) => {
  e.preventDefault()
  if (img > 0 && img != null && img != undefined) {
    if (goLive.innerText === "Stream") {
      if (context !== undefined && context.state !== "running") {
        context.resume()
      }

      if (audioPreprocessNode === undefined || audioPreprocessNode === null) {
        showMsg("Accept audio permissions")
        return
      }

      if (isMaintained) {
        showMsg("We are currently in maintainance, we'll be back shortly")
        return
      }
      loadModal("popup_timer")
    } else {
      isLive = false
      socket.emit("end", socket.id)
      goLive.innerText = "Stream"
      goLive.style = "background-color: var(--secondary-color);"
      clearSelected()
      if (audioPreprocessNode !== undefined && audioPreprocessNode != null) {
        audioPreprocessNode.removeEventListener("audioprocess", packetStream)
      }
    }
  } else {
    showMsg("Set up a profile first, click the circle button at the top")
  }
})

beginBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (selected == null) {
    showMsg("Select stream time")
    return
  }

  const doc = {
    utc: new Date().toUTCString(),
    platform: "web",
    data: {
      userName: userName,
      image: pos - 1,
      location: locate,
      bio: bio,
      facebook: facebook,
      instagram: instagram,
      twitter: twitter,
      website: website,
    },
  }

  if (selected === "5") {
    const token = generateUUID()
    check(doc, selected, token)
  } else if (selected === "10") {
    if (opt1 == null) {
      pVal = 3 * parseInt(naira)
      const email = emailField.value
      if (!email) {
        showMsg("Enter your email")
        return
      }

      pSetUp(selected, email, pVal)
    } else {
      check(doc, selected, opt1)
    }
  } else if (selected === "20") {
    if (opt2 == null) {
      pVal = 5 * parseInt(naira)
      const email = emailField.value
      if (!email) {
        showMsg("Enter your email")
        return
      }

      pSetUp(selected, email, pVal)
    } else {
      check(doc, selected, opt2)
    }
  } else if (selected === "30") {
    if (opt3 == null) {
      pVal = 7 * parseInt(naira)
      const email = emailField.value
      if (!email) {
        showMsg("Enter your email")
        return
      }

      pSetUp(selected, email, pVal)
    } else {
      check(doc, selected, opt3)
    }
  }
})

function check(doc, sel, token) {
  socket.emit("stream", {
    data: doc,
    userId: socket.id,
    selected: sel,
    token: token,
  })
}

socket.on("stream", (data) => {
  if (data.busy) {
    if (data.wrong) {
      clearOpts(selected)
    }
    showMsg(data.msg)
  } else {
    streamerDoc = data.data.data
    streamerBtn.src = `./assets/icons/mood_${streamerDoc.image + 1}.png`
    isLive = true
    clearOpts(selected)
    clearModal()
    goLive.style = "background-color: var(--accent-color);"
    goLive.innerText = "End"

    if (audioPreprocessNode !== undefined && audioPreprocessNode != null) {
      audioPreprocessNode.addEventListener("audioprocess", packetStream)
    }
  }
})

function pSetUp(sel, email, amt) {
  const handler = PaystackPop.setup({
    key: payHash(),
    email: email,
    amount: `${amt}00`,
    callback: (response) => {
      if (response.status == "success") {
        const token = generateUUID()
        if (sel === "10") {
          localStorage.setItem("opt1", token)
          opt1 = token
          const items = selectDiv.children
          items[1].children[0].children[1].src = `./assets/icons/unlock.png`
        } else if (sel === "20") {
          localStorage.setItem("opt2", token)
          opt2 = token
          const items = selectDiv.children
          items[2].children[0].children[1].src = `./assets/icons/unlock.png`
        } else if (sel === "30") {
          localStorage.setItem("opt3", token)
          opt3 = token
          const items = selectDiv.children
          items[3].children[0].children[1].src = `./assets/icons/unlock.png`
        }

        const doc = {
          utc: new Date().toUTCString(),
          selected: sel,
          token: token,
        }
        socket.emit("store", doc)
        pVal = 0
        emailField.value = null
      } else {
        showMsg(`Something went wrong try again`)
      }
    },
    onClose: function () {
      showMsg("Transaction cancelled")
    },
  })
  handler.openIframe()
}

function clearOpts(option) {
  const items = selectDiv.children
  if (option === "10") {
    opt1 = null
    localStorage.removeItem("opt1")
    items[1].children[0].children[1].src = `./assets/icons/lock.png`
    return
  }

  if (option === "20") {
    opt2 = null
    localStorage.removeItem("opt2")
    items[2].children[0].children[1].src = `./assets/icons/lock.png`
    return
  }

  if (option === "30") {
    opt3 = null
    localStorage.removeItem("opt3")
    items[3].children[0].children[1].src = `./assets/icons/lock.png`
    return
  }
}

async function audioStream(byteArray) {
  const wavBytes = await getWavBytes(byteArray, {
    isFloat: false,
    numChannels: 1,
    sampleRate: 44100,
  })
  context.decodeAudioData(wavBytes.buffer, play)
}

function play(audioBuffer) {
  context.resume().then(async () => {
    if (!isMute) {
      const source = context.createBufferSource()
      source.buffer = audioBuffer
      source.connect(context.destination)
      source.start(0)
    }

    const data = await normalizeData(filterData(audioBuffer))
    draw(data)
  })
}

const filterData = (audioBuffer) => {
  const rawData = audioBuffer.getChannelData(0)
  const samples = 200
  const blockSize = Math.floor(rawData.length / samples)
  return new Array(samples)
    .fill(0)
    .map((_, i) =>
      rawData
        .slice(i * blockSize, (i + 1) * blockSize)
        .reduce((sum, val) => sum + Math.abs(val), 0)
    )
}

const normalizeData = (filteredData) => {
  const multiplier = Math.max(...filteredData) ** -1
  return filteredData.map((val) => val * multiplier)
}

const drawLineSegment = (ctx, x, height, width, isEven) => {
  ctx.lineWidth = 2
  ctx.strokeStyle = "#fff"
  ctx.beginPath()
  height = isEven ? height : -height
  ctx.moveTo(x, 0)
  ctx.lineTo(x, height)
  ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven)
  ctx.lineTo(x + width, 0)
  ctx.stroke()
}

const draw = (normalizedData) => {
  const canvas = wave
  const dpr = window.devicePixelRatio || 1
  const padding = 20
  canvas.width = canvas.offsetWidth * dpr
  canvas.height = (canvas.offsetHeight + padding * 2) * dpr
  const ctx = canvas.getContext("2d")
  ctx.scale(dpr, dpr)
  ctx.translate(0, canvas.offsetHeight / 2 + padding)

  const width = canvas.offsetWidth / normalizedData.length
  normalizedData.forEach((val, i) => {
    const x = width * i
    let height = val * canvas.offsetHeight - padding
    if (height < 0) {
      height = 0
    } else if (height > canvas.offsetHeight / 2) {
      height = height > canvas.offsetHeight / 2
    }
    drawLineSegment(ctx, x, height, width, (i + 1) % 2)
  })
}

muteBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const targetElement = e.target || e.srcElement
  const src = targetElement.getAttribute("src")
  const item = src.split("icons/")
  const val = item[1].split(".")[0]

  if (context !== undefined && context.state !== "running") {
    context.resume()
  }

  if (val === "mic") {
    isMute = false
    muteBtn.src = "./assets/icons/mic_block.png"
  } else {
    isMute = true
    muteBtn.src = "./assets/icons/mic.png"
  }
})

const packetWave = async (e) => {
  let input = await e.inputBuffer.getChannelData(0)
  let buffer = new ArrayBuffer(input.length * 2)
  let output = new DataView(buffer)
  for (let i = 0, offset = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]))
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }

  const wavBytes = await getWavBytes(buffer, {
    isFloat: false,
    numChannels: 1,
    sampleRate: 44100,
  })
  context.decodeAudioData(wavBytes.buffer, showWave)
}

const packetStream = async (e) => {
  if (isLive) {
    let input = await e.inputBuffer.getChannelData(0)
    let buffer = new ArrayBuffer(input.length * 2)
    let output = new DataView(buffer)
    for (let i = 0, offset = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]))
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }

    socket.emit("audio", buffer)
    const wavBytes = await getWavBytes(buffer, {
      isFloat: false,
      numChannels: 1,
      sampleRate: 44100,
    })
    context.decodeAudioData(wavBytes.buffer, showWave)
  }
}

function showWave(buffer) {
  const data = normalizeData(filterData(buffer))
  draw(data)
}
