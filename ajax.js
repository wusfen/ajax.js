/**
 * https://github.com/wusfen/ajax.js
 * wushufen 20171228~20180108
 */
!(function() {
    if (!window.XMLHttpRequest) {
        window.XMLHttpRequest = function() {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }
    }

    function ajax(options) {

        // args
        options = options || {}
        var _ = options
        _.base = _.base || ajax.base || ''
        _.url = _.url || ''
        _.url = _.base && !_.url.match('://') ? _.base + '/' + _.url : _.url
        _.type = _.type || 'GET'
        _.type = _.type.toUpperCase()
        _.async = _.async !== undefined ? _.async : true
        _.before = _.before || ajax.before || function() {}
        _.success = _.success || function() {}
        _.error = _.error || function() {}
        ajax.options = options

        // data
        var data = _.data = _.data || {}
        var kvs = []
        data._t_ = new Date().getTime()
        for (var key in data) {
            kvs.push(key + '=' + data[key])
        }
        data = kvs.join('&') // key=value&key2=value2

        // xhr
        var xhr = new XMLHttpRequest()
        ajax.xhr = xhr

        // before
        if (_.before(xhr, options)) {
            return
        }

        // handle
        xhr.onreadystatechange = function() {
            // console.log(xhr.readyState, xhr.status, xhr.responseText)
            if (xhr.readyState != 4) return

            // success
            if (xhr.status == 0 || xhr.status == 200 || xhr.status == 304) {

                // res
                var res = xhr.responseText
                try { res = JSON.parse(res) } catch (e) {}
                ajax.res = res

                // callback
                if (ajax.callback) {
                    ajax.callback(xhr, options, res)
                } else {
                    _.success(res)
                }

            }
            // error
            else {

                // callback
                if (ajax.callback) {
                    ajax.callback(xhr, options, '')
                } else {
                    _.error(xhr)
                }

            }
        }

        // send
        _._url_ = location.href.match(/[?&#]ajaxLocal/i) && _.local ? _.local : _.url
        _._url_ = _._url_ + '?' + data
        xhr.open(_.type, _._url_, _.async)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded charset=UTF-8')
        xhr.send(_.type == 'POST' ? data : null)

        return xhr
    }

    ajax.post = function(options) {
        options.type = 'POST'
        return ajax(options)
    }
    ajax.get = function(options) {
        options.type = 'GET'
        return ajax(options)
    }

    // export
    if (typeof define != 'undefined' && (define.cmd || define.amd)) {
        define(function(require, exports, module) {
            return module.exports = ajax
        })
    } else
    if (typeof window != 'undefined') {
        window.ajax = ajax
        if (typeof $ == 'undefined') {
            $ = {
                ajax: ajax
            }
        }
    }
})();