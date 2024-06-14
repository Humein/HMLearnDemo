# AppRouterPlugin

### 简介
编译阶段生成路由表数据，辅助实现动态路由功能

### 使用方式
### 1.在项目工程hvigor目录中的hvigor-config.json5文件中配置
```text
{
  "dependencies": {
    //1：配置安装插件
    "app_router_hvigor_plugin": "^1.0.2"
  }
}
```

### 2.配置项目工程根目录的hvigorfile.ts文件(不是module下的hvigorfile.ts)
```text
import { appTasks } from '@ohos/hvigor-ohos-plugin';
//1：导入插件包
import {AppRouterModulePlugin } from "app_router_hvigor_plugin"

export default {
    system: appTasks,
    //2：注册插件AppRouterModulePlugin(["entry"])，参数为字符串数组，数组里面传入entry类型的模块名
    //可传多个参数，比如AppRouterModulePlugin(["entry","testEntry"])
    plugins:[AppRouterModulePlugin(["entry"])] 
}
```
##### 参数说明AppRouterModulePlugin()
AppRouterModulePlugin方法最多可传3个参数
AppRouterModulePlugin(["entry"],"build-profile.json5","src/main/ets/_generated/AppRouterModule.ets")

第一个参数：字符串数组，数组里面传入entry类型的模块名

第二个参数：通过解析文件内容，获取modules字段下的各个模块名

第三个参数：entry模块生成模板代码的文件路径

### 3.配置各个模块的hvigorfile.ts文件(不是项目工程根目录下的hvigorfile.ts)
只需要复制两处代码，其他地方不要复制，防止出错
```text
//entry类型
import { hapTasks } from '@ohos/hvigor-ohos-plugin';
//非entry类型
import { harTasks } from '@ohos/hvigor-ohos-plugin';

//1：导入插件包和配置类(直接复制该行代码)
import { AppRouterPlugin} from "app_router_hvigor_plugin"

export default {
  system: hapTasks,//entry类型：hapTasks， 非entry类型：harTasks
  
  //2：注册插件AppRouterPlugin()(直接复制AppRouterPlugin方法块)
  plugins: [AppRouterPlugin({
    //3:(重点注意)entry类型的模块传true，非entry类型传false
    "isEntry": true,
    //扫描配置@RouterPath装饰器的组件所在的具体路径，可以加快编译速度,不配置默认路径为："src/main/ets"
    "scanPackagePath": ["src/main/ets/xxx/view", "src/main/ets/xxx/pages"]
  })]
}

```

##### 参数说明AppRouterPlugin()
```text
{
    // 当前module是否是entry类型
    isEntry: false,
    // 当前module需要扫描的包路径(建议配置使用@RouterPath装饰器的组件所在的具体路径，可以加快编译速度)，不设置默认扫描模块下面所有文件目录
    // 如果配置["src/main/ets/xxx/view", "src/main/ets/xxx/pages"]，则会扫描该路径内的所有文件
    scanPackagePath: [],
    // 当前module需要扫描的文件夹名称，比如["pages","page","view"],则会扫描模块src/main/ets内的所有pages，page，view目录以及子目录的文件
    scanPackageName: [],
    // 当前module不需要扫描的路径或者文件
    ignorePath: [],
    
    //以下全是默认配置，一般不用特意修改
    // 路由注解名称
    annotation: "RouterPath",
    // 是否开启调试模式，true:开启编译阶段输出日志
    debug: false,
    // 当前module自动生成注册组件方法的文件路径
    generatePath: "src/main/ets/_generated",
    // 当前module自动生成注册组件方法的文件名字
    generateName: "AutoRouterBuilder.ets",
    // 当前module自动生成路由表的文件名字
    generateMapName: "AutoRouterMap.ets",

    //import { AppRouter } from 'AppRouter/Index',
    //依赖的路由模块名称
    routerDependencyName: "AppRouter",
    //路由名称
    routerClassName: "AppRouter",
}
```