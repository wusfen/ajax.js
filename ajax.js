/*! @preserve https://github.com/wusfen/ajax.js */
!(function (window) {
  if (!window.XMLHttpRequest) {
    window.XMLHttpRequest = function () {
      return new ActiveXObject("Microsoft.XMLHTTP")
    }
  }

  function ajax(options) {
    var xhr = new XMLHttpRequest

    // res
    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4) return
      var status = xhr.status
      var res = xhr.responseText
      try { res = JSON.parse(res) } catch (e) { }

      // success
      if (status == 0 || (status >= 200 && status < 300) || status == 304) {
        options.success && options.success(res)
      }
      // error
      else {
        options.error && options.error(xhr)
      }
    }

    // headers
    var headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    for (var k1 in options.headers) {
      var key = k1
      for(var k2 in headers) if(k1.toLowerCase() == k2.toLowerCase()) key = k2
      headers[key] = options.headers[k1]
    }

    // type
    var type = (options.type || 'get').toUpperCase()

    // data
    var data = options.data || ''
    if (typeof data == 'object') {
      if (headers['Content-Type'].match('form-urlencoded')) data = toUrlSearchParams(data)
      if (headers['Content-Type'].match('json')) data = JSON.stringify(data)
    }

    // href
    var href = options.href || '.'
    if (type == 'GET' && data) {
      href += (href.match(/\?/) ? '&' : '?') + data
    }

    console.log(type, data, href, headers)

    // send
    xhr.open(type, href, true)
    for (var key in headers) {
      xhr.setRequestHeader(key, headers[key])
    }
    xhr.send(type == 'POST' ? data : null)
    return xhr
  }

  // x-www-form-urlencoded
  function toUrlSearchParams(value) {
    var params = ''

    function loopValue(key, value) {
      if (value && (value.constructor == Object || value instanceof Array)) {
        for (var k in value) {
          if (!value.hasOwnProperty(k)) continue
          var subKey = !key ? k : '[' + k + ']' // obj[k]
          loopValue(key + subKey, value[k])
        }
      } else {
        if (value === undefined || value === null) value = ''
        if (typeof value === 'function') value = value()
        key = key.replace(/\[\d+?\]$/g, '[]') // obj[arr][0] => obj[arr][]
        key = encodeURIComponent(key)
        value = encodeURIComponent(value)
        params += (params ? '&' : '') + key + '=' + value // &obj[k][s]=value
      }
    }
    loopValue('', value)

    return params.replace(/%20/g, '+') // ' ' => '+'
  }

  // export
  if (typeof module != 'undefined') {
    module.exports = ajax
  } else {
    window.ajax = ajax
  }
})(window);