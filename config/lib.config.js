/**
 * @module 配置package.json的参数和webpack.config的参数。
 * 
 */
module.exports = {
    libraryName: 'cascading-picker', // npm包名，首字母不允许大写，支持驼峰和短杆写法
    bundleName: 'CascadingPicker', // 打包后文件名，也是UMD script直接引入挂在windows对象的key名
    version: '0.2.2', // 版本号
    description: 'CascadingPicker for Vue 2', // 包描述
    keywords: ['vue2', 'address-picker', 'address-picker-vue', 'CascadingPicker'], // 关键词
    author: 'Alan Chen', // 作者
    repository: { // 仓库地址和首页地址
        type: 'git',
        url: 'https://github.com/alanchenchen/vue-address-picker'
    }
}