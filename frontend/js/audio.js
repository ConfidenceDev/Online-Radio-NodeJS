const socket = io("https://vebbo-community.herokuapp.com/", { secure: true })
const url = "https://vebbo-community.herokuapp.com/music"
//const socket = io("http://localhost:5050")
//const url = "http://localhost:5050/music"

socket.binaryType = "arraybuffer"
let context
let noiseGate, mediaStreamSource, audioPreprocessNode

if (!window.AudioContext) {
  if (!window.webkitAudioContext) {
    showMsg(
      "Your browser does not support any AudioContext and cannot play back this audio."
    )
  } else {
    window.AudioContext = window.webkitAudioContext
  }
}

context = new AudioContext({
  latencyHint: "interactive",
})

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL

const constraints = {
  video: false,
  audio: {
    echoCancellation: false,
    mozNoiseSuppression: false,
    mozAutoGainControl: false,
  },
}
navigator.mediaDevices
  .getUserMedia(constraints)
  .then(gotStream)
  .catch((e) => {
    console.error("Failed to get media: " + e)
  })

function gotStream(stream) {
  mediaStreamSource = context.createMediaStreamSource(stream)
  audioPreprocessNode = context.createScriptProcessor(16384, 1, 1)
  // 256, 512, 1024, 2048, 4096, 8192, 16384

  noiseGate = new NoiseGateNode(context)
  audioPreprocessNode.connect(noiseGate)
  mediaStreamSource.connect(audioPreprocessNode)

  audioPreprocessNode.connect(context.destination)
  noiseGate.connect(context.destination)
  //mediaStreamSource.connect(context.destination)
}
