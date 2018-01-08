# ajax.js

方便实用的 ajax 插件，兼容 jquery api

```javascript

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
```
