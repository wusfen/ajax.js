# ajax.js

ajax 插件

## usage
```javascript
xhr = ajax({
  url: 'url',
  type: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
  responseType: '',
  data: { // 内部会根据头部自动转成对应的格式
    key: 'value'
  },
  success: function(res){  
    console.log(res)
  }
})
```
