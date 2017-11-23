## 作者：Alan Chen
## e-mail:739709491@qq.com
# address-picker
基于vue编写的移动端地址三级联动,直接导入组件，不依赖任何第三方组件或插件，需要用脚手架导入，因为是vue单页文件
* 注意：仓库中的address-data.js为地址的数据，必须和组件在同一级目录
![avatar](/picker.gif)
# 调用方法:
* 1.必须传一个`props:'addressShow'`，布尔值，控制地址选择器显示与否
* 2.自定义`ok`和`cancel`事件，表示当address-picker组件点击确定按钮和取消按钮的操作
* 3.`ok`事件将当前选中的省市区传给父组件事件，cancel事件让父组件的addressShow值变为false
# 使用demo
```javascript
<address-picker :addressShow="addressShow" @ok="ok" @cancel="addressShow=false"></address-picker>
//在父组件ok自定义事件中回调传入的是一个对象
{province:'天津市',city:河西区,town:''});//键名分别在左侧，如果town没有则返回一个空字符串
