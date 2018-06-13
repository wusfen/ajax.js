# ajax.js

方便实用的 ajax 插件

```javascript

// 请求示例
xhr = ajax({
    url: 'url',
    type: 'post',           // 默认 'get'
    data: {                 // 请求参数
        key: 'value'
    },
    success: function(res){  
        // 如果返回为 json ，则 res 已自动解析
        // 默认就 res 一个参数，可在全局配置 after 里自定义传多个参数
        // 如 res.data 作为第二个参数 data
        //...
    }
})

// 换种写法
ajax.post(options)
ajax.get(options)

// 保存了最后一次信息，方便调试
ajax.xhr
ajax.options
ajax.res


// 全局配置
ajax.setUp({
    base: 'server/path',   // url base
    type: 'post',          // 修改默认 type
    headers: {             // 请示头
        'Content-Type': 'application/json'
    },
    before: function (xhr, options) {      // 发送前处理
        // loading...

        // 对请求参数进行处理
        options.data = JSON.stringify(options.data, null, '  ')

        // return true // if return true 则取消发送
    },
    after: function(xhr, options, res) {   // 返回后处理
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
