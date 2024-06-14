export class AppRouterConfig {
    isEntry:boolean=false;
    // 扫描的包路径
    scanPackagePath: string[] = [];
    // 需要扫描的文件夹名称
    scanPackageName: string[] = [];
    // 不需要扫描的路径或者文件
    ignorePath: string[] = [];
    //路由注解名称
    annotation: string=""
    debug: boolean = false

    //自动生成注册组件方法的文件路径
    generatePath?: string
    //自动生成注册组件方法的文件名字
    generateName?: string
    //自动生成路由表的文件名字
    generateMapName?: string

    //被Entry模块依赖时设置的别名
    entryDependencyName?: string//@ohos/Har

    //import { AppRouter } from '@ohos/approuter/Index';
    //依赖的路由模块名称
    routerDependencyName: string = ""//@ohos/approuter
    //路由名称
    routerClassName: string = ""//AppRouter

    //路由生成常量类所在模块名称(暂时不用，比较鸡肋)
    routerModuleName: string = ""
    routerConstantPath: string = ""
}