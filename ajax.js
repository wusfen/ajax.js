/**
 * https://github.com/wusfen/ajax.js
 * wushufen 20171228~20180707
 */
!(function (window) {
    if (!window.XMLHttpRequest) {
        window.XMLHttpRequest = function () {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }
    }

    var noop = function () { }

    var setting = {
        base: '',
        url: '',
        type: 'get',
        data: {},
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        async: true,
        cache: false,
        mock: false,
        before: noop,
        after: noop,
        success: noop,
        error: noop
    }

    // webpack 中 typeof+module.exports 会报错
    // https://github.com/webpack/webpack/issues/7318
    var typeOf = function (obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
    }

    var extend = function (obj, _obj) {
        for (var key in _obj) {
            var val = obj[key]
            var _val = _obj[key]
            if (typeOf(_val) == 'object') {
                obj[key] = extend(val ? val : {}, _val)
            } else {
                obj[key] = _obj[key]
            }
        }
        return obj
    }

    var map = function (arr, fn) {
        var list = []
        for (var i = 0; i < arr.length; i++) {
            list[i] = fn(arr[i], i)
        }
        return list
    }

    var serialize = function (value) {
        var arr = [] // [ {keys, value}, ]

        !(function loop(value, keys) {
            if (typeof value != 'object') {
                arr.push({ keys: keys, value: value })
            } else {
                for (var k in value) {
                    loop(value[k], keys.concat(k)) // [k1,k2,..]
                }
            }
        })(value, [])

        // [ 'obj[key][]=value', ]
        arr = map(arr, function (item, i) {
            var keyPath = ''
            var keys = item.keys
            map(keys, function (key, i) {
                var _key = '[' + key + ']'
                if (i == 0) {
                    _key = key
                }
                var lastI = keys.length - 1
                if (i == lastI && !isNaN(keys[lastI])) {
                    _key = '[]'
                }
                keyPath += _key
            })
            // ecKeyPath=ecValue
            return encodeURIComponent(keyPath) + (keyPath ? '=' : '') + encodeURIComponent(item.value)
        })

        // ...&...
        return arr.join('&')
    }

    function ajax(options) {
        var _setting = extend({}, setting)
        options = extend(_setting, options)
        options.type = options.type.toUpperCase()
        ajax.options = options

        // before
        if (options.before(xhr, options)) {
            return
        }

        // data
        var data = options.data
        // raw, text||application/json
        if (typeOf(data) == 'string') {
            options.dataStr = data
        }
        // form
        else {
            options.dataStr = serialize(data)
        }

        // href
        options.href = options.url
        if (options.base && !options.url.match('://')) {
            options.href = options.base + '/' + options.url
        }
        if (options.type == 'GET') {
            options.href = options.href + '?' + options.dataStr
        }


        // xhr
        var xhr = new XMLHttpRequest
        ajax.xhr = xhr

        // handle
        xhr.onreadystatechange = function () {
            // console.log(xhr.readyState, xhr.status, xhr.responseText)
            if (xhr.readyState != 4) return

            // success
            if (xhr.status == 0 || xhr.status == 200 || xhr.status == 304) {

                // res
                var res = xhr.responseText
                try { res = JSON.parse(res) } catch (e) { }
                ajax.res = res

                // after
                if (options.after(xhr, options, res)) {
                    return
                }
                options.success(res)

            }
            // error
            else {

                // after
                if (options.after(xhr, options, '')) {
                    return
                }
                options.error(xhr)

            }
        }

        // send
        xhr.open(options.type, options.href, options.async)

        // headers
        for (var key in options.headers) {
            xhr.setRequestHeader(key, options.headers[key])
        }
        xhr.send(options.type == 'POST' ? options.dataStr : null)

        return xhr
    }

    ajax.setting = setting
    ajax.post = function (options) {
        options.type = 'POST'
        return ajax(options)
    }
    ajax.get = function (options) {
        options.type = 'GET'
        return ajax(options)
    }
    ajax.setUp = function (options) {
        return extend(setting, options)
    }

    // export
    module.exports = ajax
    // window.ajax = ajax
})(typeof window != 'undefined' ? window : global);