import { appTasks } from '@ohos/hvigor-ohos-plugin';
// 导入插件包

// https://www.npmjs.com/package/hvigor-easy-router-plugin?activeTab=versions
import RouterCompilePlugin from 'hvigor-easy-router-plugin'

// https://www.npmjs.com/package/app_router_hvigor_plugin
import { AppRouterPlugin } from "app_router_hvigor_plugin"


export default {
    system: appTasks,  /* Built-in plugin of Hvigor. It cannot be modified. */
    // 注册插件
    // RouterCompilePlugin() 这个插件有问题
    plugins: []      /* Custom plugin to extend the functionality of Hvigor. */
}
