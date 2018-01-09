# ajax.js

方便实用的 ajax 插件

* 可指定统一 base url
* 可统一处理回调，统一处理报错
* 可切换本地 json文件 调试
* 自动解析返回 json
* 兼容 jquery $.ajax
* 支持 script标签引入
* 支持 seajs
* 支持 requirejs
* 支持 webpack
* 支持 ie5+

```javascript

// base
ajax.base = 'server/path'

// before
ajax.before = function (xhr, options) {

    // 添加一个简易的 loading...
    document._title = document.title
    document.title = 'loading...'

    // return true // 返回true则取消发送
}

// 统一回调处理
ajax.callback = function(xhr, options, res) {
    
    // loading 结束
    setTimeout(function () {
        document.title = document._title
    }, 300)

    // 符合条件才调用 success
    if (res && !res.error) {

        options.success(res, res.data || []) // 自定义success参数

    // 错误处理
    } else {
        alert(options.url + ': ' + (res.msg || '请求出错'))
    }

}

// 请求示例
xhr = ajax({
    url: 'url',             // 'http://' 写完整的url 不使用 base
    local: 'data/x.json',   // location.href.match(/[?&#]ajaxLocal/i) 开启本地json
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
