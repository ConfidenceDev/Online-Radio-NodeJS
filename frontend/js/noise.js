;(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f()
  } else if (typeof define === "function" && define.amd) {
    define([], f)
  } else {
    let g
    if (typeof window !== "undefined") {
      g = window
    } else if (typeof global !== "undefined") {
      g = global
    } else if (typeof self !== "undefined") {
      g = self
    } else {
      g = this
    }
    g.NoiseGateNode = f()
  }
})(function () {
  let define, module, exports
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          let a = typeof require == "function" && require
          if (!u && a) return a(o, !0)
          if (i) return i(o, !0)
          let f = new Error("Cannot find module '" + o + "'")
          throw ((f.code = "MODULE_NOT_FOUND"), f)
        }
        let l = (n[o] = { exports: {} })
        t[o][0].call(
          l.exports,
          function (e) {
            let n = t[o][1][e]
            return s(n ? n : e)
          },
          l,
          l.exports,
          e,
          t,
          n,
          r
        )
      }
      return n[o].exports
    }
    let i = typeof require == "function" && require
    for (let o = 0; o < r.length; o++) s(r[o])
    return s
  })(
    {
      1: [
        function (require, module, exports) {
          "use strict"

          let _createClass = (function () {
            function defineProperties(target, props) {
              for (let i = 0; i < props.length; i++) {
                let descriptor = props[i]
                descriptor.enumerable = descriptor.enumerable || false
                descriptor.configurable = true
                if ("value" in descriptor) descriptor.writable = true
                Object.defineProperty(target, descriptor.key, descriptor)
              }
            }
            return function (Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps)
              if (staticProps) defineProperties(Constructor, staticProps)
              return Constructor
            }
          })()

          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function")
            }
          }

          let FILTER_PARAMS = ["type", "frequency", "gain", "detune", "Q"]
          let COMPRESSOR_PARAMS = [
            "threshold",
            "knee",
            "ratio",
            "attack",
            "release",
          ]
          let DEFAULT_OPTIONS = {
            threshold: -50,
            knee: 40,
            ratio: 12,
            reduction: -20,
            attack: 0,
            release: 0.25,
            Q: 8.3,
            frequency: 355,
            gain: 3.0,
            type: "bandpass",
          }

          let NoiseGateNode = (function () {
            function NoiseGateNode(audioCtx) {
              let options =
                arguments.length > 1 && arguments[1] !== undefined
                  ? arguments[1]
                  : {}

              _classCallCheck(this, NoiseGateNode)

              options = Object.assign({}, DEFAULT_OPTIONS, options)

              let compressorPramas = this.selectParams(
                options,
                COMPRESSOR_PARAMS
              )
              let filterPramas = this.selectParams(options, FILTER_PARAMS)

              this.compressor = new DynamicsCompressorNode(
                audioCtx,
                compressorPramas
              )
              this.filter = new BiquadFilterNode(audioCtx, filterPramas)

              this.compressor.connect(this.filter)

              return this.filter
            }

            _createClass(NoiseGateNode, [
              {
                key: "selectParams",
                value: function selectParams(object, filterArr) {
                  return Object.keys(object).reduce(function (opt, p) {
                    if (filterArr.includes(p)) {
                      opt[p] = object[p]
                    }
                    return opt
                  }, {})
                },
              },
              {
                key: "setParams",
                value: function setParams(node, audioParams) {
                  for (let param in audioParams) {
                    let value = audioParams[param]
                    if (node[param] instanceof AudioParam) {
                      node[param].value = value
                    } else {
                      node[param] = value
                    }
                  }
                },
              },
            ])

            return NoiseGateNode
          })()

          exports = module.exports = NoiseGateNode
        },
        {},
      ],
    },
    {},
    [1]
  )(1)
})

/*
compressor,
  convolver,
  gainNode,
  noiseGate,
  
gainNode = context.createGain()
  gainNode.gain.value = 1

  convolver = context.createConvolver()
  compressor = context.createDynamicsCompressor()
  compressor.threshold.value = -50
  compressor.knee.value = 40
  compressor.ratio.value = 12
  compressor.reduction.value = -20
  compressor.attack.value = 0
  compressor.release.value = 0.25

  filter = context.createBiquadFilter()
  filter.Q.value = 8.3
  filter.frequency.value = 355
  filter.gain.value = 3.0
  filter.type = "notch"

  compressor.connect(convolver)
  gainNode.connect(compressor)
  filter.connect(gainNode)
  audioPreprocessNode.connect(filter)
  mediaStreamSource.connect(audioPreprocessNode)

  gainNode.connect(context.destination)
  compressor.connect(context.destination)
  filter.connect(context.destination)
  audioPreprocessNode.connect(context.destination)
  
  ========================================================
  compressor = context.createDynamicsCompressor()
  compressor.threshold.value = -50
  compressor.knee.value = 40
  compressor.ratio.value = 12
  compressor.reduction.value = -20
  compressor.attack.value = 0
  compressor.release.value = 0.25

  filter = context.createBiquadFilter()
  filter.type = "peaking"
  filter.gain.value = 30

  compressor.connect(filter)
  audioPreprocessNode.connect(compressor)
  mediaStreamSource.connect(audioPreprocessNode)

  filter.connect(context.destination)
  compressor.connect(context.destination)
  
  */
//mediaStreamSource.connect(context.destination)
