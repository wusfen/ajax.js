/*! @preserve https://github.com/wusfen/data.js */
!(function () {

  var typeOf = function (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
  }

  var random = {
    id: function (base, step, target) {
      // todo target
      base = base || 1
      step = step || 1
      var i = this.i = this.i || 0
      var value = base + step * i
      this.i += 1
      return value
    },
    number: function (min, max, fixed) {
      min = min || 0
      max = max || 100
      fixed = fixed || 0
      var diff = max - min
      var value = Math.random() * diff + min
      value = +value.toFixed(fixed)
      return value
    },
    boolean: function (rate) {
      rate = rate || .5
      return Math.random() < rate ? true : false
    },
    date: function (min, max) {
      min = min || +new Date - 1000 * 60 * 60 * 24 * 365
      max = max || +new Date + 1000 * 60 * 60 * 24 * 365
      var value = random.number(min, max)
      return new Date(value)
    },
    string: function (min, max, space) {
      min = min || 10
      max = max || min
      space = space || ' '
      var endCode = 0x007a
      var startCode = 0x0061

      var length = random.number(min, max)
      var str = ''
      for (var i = 0; i < length; i++) {
        var code = random.number(endCode, startCode)
        var char = String.fromCharCode(code)
        // char = Math.random() < .16? space : String.fromCharCode(code)
        str += char
      }
      return str
    },
    zh: function (min, max) {
      min = min || 25
      max = max || min
      var chars = '我人有的和主产不为这工要在地一上是中国经以发了民同'
      var length = random.number(min, max)
      var str = ''
      for (var i = 0; i < length; i++) {
        var index = random.number(0, chars.length - 1)
        var char = chars.charAt(index)
        str += char
      }
      return str
    },
    repeat: function (s, min, max) {
      s = xquo(s)
      var length = random.number(min, max)
      var str = ''
      for (var i = 0; i < length; i++) {
        str += s
      }
      return str
    },
    url: function (min, max) {
      min = min || 5
      max = max || 20
      return 'http://' + random.string(3, 7) + '.com/' + random.string(min, max)
    },
    email: function (min, max) {
      min = min || 5
      max = max || 10
      return random.string(min, max) + '@' + random.string(3, 7) + '.com'
    },
    name: function () {
      var n1 = '赵钱孙李周吴郑王'.split('')[random.number(0, 7)]
      var n2 = '春夏秋冬,'.split(/,|\B/)[random.number(0, 4)]
      var n3 = '梅兰竹菊'.split('')[random.number(0, 3)]
      return n1 + n2 + n3
    },
    img: function (width, height, bg, text) {
      width = width || 200
      height = height || 100
      bg = bg || '#eee'
      text = text || width + ' x ' + height

      if (typeof document == 'undefined') return
      var canvas = this.canvas = this.canvas || document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      var ctx = canvas.getContext('2d')

      // document.body.appendChild(canvas)
      // window.canvas = canvas
      // window.ctx = ctx

      ctx.fillStyle = bg
      ctx.fillRect(0, 0, width, height)

      var fontSize = width < 70 ? 10 : 20
      ctx.fillStyle = '#a9a9a9'
      ctx.font = fontSize + 'px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, width / 2, height / 2)

      return canvas.toDataURL()
    }
  }

  function Data(rule) {
    if ('string' == typeOf(rule)) {
      var m_a = rule.split('(') // method(100, 5) => ['method', '100, 5)']
      // method
      var method = m_a[0]
      if (method in random) {
        var args = (m_a[1] || '').replace(')', '')
        // args
        args = args.split(',')
        // to number
        for (var i = args.length - 1; i >= 0; i--) {
          var arg = args[i]
          // '"arg"' => 'arg'
          args[i] = arg.replace(/^\s*["']|["']\s*$/g, '')
          if (!isNaN(arg)) {
            args[i] = Number(arg)
          }
        }
        // ()
        return random[method].apply(random, args)
      }
    }
    if ('object' == typeOf(rule)) {
      var obj = {}
      for (var key in rule) {
        var value = rule[key]
        obj[key] = Data(value)
      }
      return obj
    }
    if ('array' == typeOf(rule)) {
      var arr = []
      var obj = rule[0]
      var min = rule[1] || 1
      var max = rule[2] || min
      var length = obj ? random.number(min, max) : 0
      for (var i = 0; i < length; i++) {
        arr[i] = Data(obj)
      }
      return arr
    }
    return rule
  }

  if (typeof module != 'undefined') {
    module.exports = Data
  } else {
    window.Data = Data
  }
})()
