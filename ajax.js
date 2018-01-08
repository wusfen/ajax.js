/**
 * wushufen
 * 20171228
 * 20180108
 */
/*

// base
ajax.base = 'server/path'

// 统一回调处理
ajax.callback = function(xhr, options, res) {

    // 符合条件才调用 success
    if (res && !res.error) {

        // 添加参数
        options.success(res, res.data || [])

    // 错误处理
    } else {
        alert(options.url + ': ' + (res.msg || '请求出错'))
    }
}

// 请求示例
xhr = ajax({
    url: 'url',
    local: 'data/x.json',   // location.href.match(/[?&#]ajaxLocal/i) 开启本地json
    type: 'post',           // 默认 'get'
    data: {
        key: 'value'
    },
    // json 自动解析
    success: function(res, data){
        //...
    }
})

ajax.post(options)
ajax.get(options)

// 保存最后一次信息，方便调试
ajax.options
ajax.res

*/
!(function() {
    function ajax(options) {

        // args
        options = options || {}
        var _ = options
        _.base = _.base || ajax.base || ''
        _.url = _.url || ''
        _.url =  _.base && !_.url.match('://') ? _.base + '/' + _.url : _.url
        _.type = _.type || 'GET'
        _.type = _.type.toUpperCase()
        _.async = _.async !== undefined ? _.async : true
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
        xhr.send(data)

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