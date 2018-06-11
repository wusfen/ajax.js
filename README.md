# ajax.js

方便实用的 ajax 插件

```javascript

// 请求示例
xhr = ajax({
    url: 'url',             // 'http://' 写完整的url 不使用 base
    type: 'post',           // 默认 'get'
    data: {                 // 请求参数
        key: 'value'
    },
    // json 自动解析
    success: function(res, data){   // 默认就 res 一个参数，可在全局配置after里自定义传多个参数如 res.data 作为第二个参数
        //...
    }
})

// 换种写法
ajax.post(options)
ajax.get(options)

// 保存最后一次信息，方便调试
ajax.xhr
ajax.options
ajax.res


// 全局配置
ajax.setUp({
    base: 'server/path',
    type: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    before: function (xhr, options) {
        // loading...

        // 对请求参数进行处理
        options.data = JSON.stringify(options.data, null, '  ')

        // return true // if返回true则取消发送
    },
    after: function(xhr, options, res) {
        // loading 结束

        // 对响应结果进行判断
        if (res && res.errorCode = 0) {

            // 手动调用 success 并传参
            options.success(res, res.data)

        } else {

            // 统一处理错误
            console.log(res.msg || '请求出错')
        }

        // 表示已经处理了，不会再调 success, error
        return true
    }
})

// 当前的全局配置
ajax.setting

```


vue项目，import Vue 和 ajax 后加这行代码，方便使用
```javascript
Vue.prototype.ajax = ajax
```
示例
```javascript
var vue = new Vue({
    // ...
    methods: {
        fun: function(){
            this.ajax(options)
        }
    }
})
```
