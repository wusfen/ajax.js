# ajax.js

方便实用的 ajax 插件

```javascript

// 基础配置
ajax.setUp({
    base: 'server/path',
    before: function (xhr, options) {

        // 对参数进行处理
        options.data = {
            data: JSON.stringify(options.data)
        }

        // 添加一个 loading...
        document._title = document.title
        document.title = 'loading...'

        // return true // 返回true则取消发送
    },
    after: function(xhr, options, res) {

        // loading 结束
        document.title = document._title

        // 判断
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


// 请求示例
xhr = ajax({
    url: 'url',             // 'http://' 写完整的url 不使用 base
    type: 'post',           // 默认 'get'
    data: {                 // 请求参数
        key: 'value'
    },
    // json 自动解析
    success: function(res, data){
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
