/**
 * @description 插件的入口模块。webpack的entry
 */
import CascadingPicker from './CascadingPicker/CascadingPicker.vue'

export default {
    install(Vue, options) {
        const componentName = (options && options.name) || CascadingPicker.name
        Vue.component(componentName, CascadingPicker)
    }
}