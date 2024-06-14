import {HvigorNode, HvigorPlugin} from '@ohos/hvigor';
import path from 'path';
import * as fs from "node:fs";
import {appendFileSync, readFileSync} from "node:fs";
import ts, {CallExpression, Decorator, Identifier, ObjectLiteralExpression, PropertyAssignment} from "typescript";
import {LG} from "./LG";
import Handlebars from "handlebars";
import {existsSync, mkdirSync, writeFileSync} from "fs";
import {AppRouterConfig} from "./AppRouterConfig";
/*********************************************************************************/
// 自动生成注册组件方法的默认文件路径
const ROUTER_GENERATE_PATH = "src/main/ets/_generated";
// 自动生成注册组件方法的默认文件名字
const ROUTER_GENERATE_BUILDER_NAME = "AutoRouterBuilder.ets";
// 自动生成路由表信息默认文件名字
const ROUTER_GENERATE_MAP_NAME = "AutoRouterMap.ets";
// 自定义注解名字
const ROUTER_NAME = "RouterPath"
//注解参数名
const ROUTER_PARAM_PATH = "path"
const ROUTER_PARAM_DES = "des"
const ROUTER_PARAM_NEED_LOGIN = "needLogin"
const ROUTER_PARAM_AUTO_EXECUTE = "autoExecute"

//依赖路由默认模块名称
const ROUTER_DEPENDENCY_NAME = "AppRouter"
//路由默认名称
const ROUTER_CLASS_NAME = "AppRouter"


//路由module名称
const ROUTER_MODULE_NAME = "AppRouter"
//路由路径常量类路径
const ROUTER_CONSTANT_PATH = "src/main/ets/constant/AppRouterPath.ets"

// 自动生成RouterBuilder文件需要的数据
class RouterBuilderInfo {
    //import View 的相对路径
    viewPath?: string
    // 组件名
    viewName?: string
    // 组件path
    routerPath?:string
}

// 自动生成路由表文件需要的数据
class RouterMapInfo {
    //路由路径转成ascii码用于排序
    sort?: string
    //路由路径
    path?: string
    //所在模块名(或者被entry模块依赖时的别名)
    pageModule?: string
    //组件名
    pageName?: string
    //是否需要登录
    needLogin?: boolean
    //登录之后是否继续执行登录前的路由逻辑
    autoExecute?: boolean
}

class RouterPathInfo {
    //路由路径
    path?: string
    //路由路径描述
    pathDes?: string
}

//获取父文件夹路径
function getParentPath(filePath: string): string {
    return path.dirname(filePath)
}

//获取父文件夹名称
function getParentName(filePath: string): string {
    return path.basename(path.dirname(filePath))
}

function getFile(filePath: string, callback?: (isFile: boolean, filePath: string) => boolean): string[] {
    if (!filePath) {
        return []
    }
    const stats = fs.lstatSync(filePath)

    const fileArray: string[] = []
    if (stats.isFile()) {
        if (!(callback?.(true, filePath))) {
            fileArray.push(filePath)
        }
        return fileArray
    } else if (stats.isDirectory()) {
        if (!(callback?.(false, filePath))) {
            fs.readdirSync(filePath).forEach(file => {
                const fullPath = path.join(filePath, file);
                fileArray.push(...getFile(fullPath, callback))
            });
        }
        return fileArray
    } else {
        return []
    }
}

function getFileByFilter(filePath: string, scanPackageName: string[], ignorePath: string[], scanPackageNameChild: boolean): string[] {
    if (!filePath) {
        return []
    }
    if (ignorePath && ignorePath.length > 0 && (ignorePath.includes(filePath))) {
        return []
    }
    const stats = fs.lstatSync(filePath)
    const fileArray: string[] = []
    if (stats.isFile()) {
        if (filePath.endsWith(".ets") || filePath.endsWith(".ETS")) {
            fileArray.push(filePath)
        }
        return fileArray
    } else if (stats.isDirectory()) {
        let needFilterDir = false
        if (scanPackageName && scanPackageName.length > 0) {
            needFilterDir = true
        }
        let dirName = path.basename(filePath)
        fs.readdirSync(filePath).forEach(file => {
            const fullPath = path.join(filePath, file);
            if (needFilterDir) {
                //scanPackageNameChild=true 如果某个文件夹名字需要扫描，则该文件下下面所有的子文件都需要扫描
                if (scanPackageNameChild) {
                    fileArray.push(...getFileByFilter(fullPath, scanPackageName, ignorePath, true))
                    return
                }
                const stats = fs.lstatSync(fullPath)

                if (stats.isFile()) {
                    if (scanPackageName.includes(dirName)) {
                        //如果scanPackageName包含该文件的父目录
                        if (fullPath.endsWith(".ets") || fullPath.endsWith(".ETS")) {
                            fileArray.push(fullPath)
                        }
                    }
                } else if (stats.isDirectory()) {
                    //scanPackageNameChild=true 如果某个文件夹名字需要扫描，则该文件下下面所有的子文件都需要扫描
                    fileArray.push(...getFileByFilter(fullPath, scanPackageName, ignorePath, scanPackageName.includes(dirName)))
                }
            } else {
                fileArray.push(...getFileByFilter(fullPath, scanPackageName, ignorePath, false))
            }
        });

        return fileArray
    } else {
        return []
    }
}

class Analyzer {
    debug: boolean = false
    //路由注解名字
    private annotation: string = ""
    //扫描到的ets文件路径
    private filePath: string = ""
    result: AnalyzerResult = new AnalyzerResult()

    constructor(annotation: string, filePath: string, debug: boolean) {
        this.debug = debug
        this.annotation = annotation;
        this.filePath = filePath;
    }

    start() {
        // 读取文件
        const sourceCode = readFileSync(this.filePath, "utf-8");
        // 解析文件，生成节点树信息
        const sourceFile = ts.createSourceFile(this.filePath, sourceCode, ts.ScriptTarget.ES2021, false);
        // 遍历节点信息
        ts.forEachChild(sourceFile, (node: ts.Node) => {
            if (this.debug) {
                //todo 遍历节点信息
                // LG.info(JSON.stringify(node))
            }
            // 解析节点
            this.resolveNode(node);
            if (this.result.routerPath && this.result.routerPath.length > 0) {
                //如果找到自定义注解和参数
                this.result.isRouterPage = true
                return true
            }
        });
    }

    resolveNode(node: ts.Node) {
        if (node.kind != ts.SyntaxKind.MissingDeclaration) {
            return false
        }
        //@Component+@自定义装饰器
        let child = node as ts.ParameterDeclaration
        let modifiers = child.modifiers
        //如果装饰器不为空且大于等于2
        if (modifiers && modifiers.length >= 2) {
            modifiers.forEach((node) => {
                let decorator = node as Decorator
                if (decorator && decorator.expression) {
                    let callExpression = decorator.expression as CallExpression
                    if (callExpression.kind == ts.SyntaxKind.CallExpression) {
                        //如果有注解和参数不为空
                        let arg = callExpression.arguments
                        if (callExpression.expression && arg && arg.length > 0) {
                            //如果注解名字匹配
                            if (this.annotation == (callExpression.expression as Identifier).escapedText) {
                                let properties: ts.NodeArray<PropertyAssignment> = (arg[0] as ObjectLiteralExpression).properties as ts.NodeArray<PropertyAssignment>
                                properties?.forEach((p) => {
                                    let identifier = p.name as Identifier
                                    if (identifier.escapedText == ROUTER_PARAM_PATH) {
                                        let path = (p.initializer as ts.StringLiteral).text
                                        if (path) {
                                            this.result.routerPath = path
                                        }
                                    }
                                    if (identifier.escapedText == ROUTER_PARAM_DES) {
                                        let text = (p.initializer as ts.StringLiteral).text
                                        if (text) {
                                            this.result.routerPathDes = text
                                        }
                                    } else if (identifier.escapedText == ROUTER_PARAM_NEED_LOGIN) {
                                        let kind = p.initializer.kind
                                        if (kind && kind == ts.SyntaxKind.FalseKeyword) {
                                            //false
                                            this.result.needLogin = false
                                        } else if (kind && kind == ts.SyntaxKind.TrueKeyword) {
                                            //true
                                            this.result.needLogin = true
                                        }
                                    } else if (identifier.escapedText == ROUTER_PARAM_AUTO_EXECUTE) {
                                        let kind = p.initializer.kind
                                        if (kind && kind == ts.SyntaxKind.FalseKeyword) {
                                            //false
                                            this.result.autoExecute = false
                                        } else if (kind && kind == ts.SyntaxKind.TrueKeyword) {
                                            //true
                                            this.result.autoExecute = true
                                        }
                                    }
                                })
                            }
                        }
                    }
                }
            })
        }
    }
}

class AnalyzerResult {
    //路由path
    routerPath?: string
    //path的页面描述
    routerPathDes?: string
    //是否需要登录
    needLogin?: boolean
    //登录之后是否需要继续执行之前的页面跳转
    autoExecute?: boolean
    //是否是注解标记的组件
    isRouterPage?: boolean
}

/*********************************************************************************/


export function AppRouterPlugin(config?: AppRouterConfig): HvigorPlugin {
    if (!config) {
        config = new AppRouterConfig()
    }
    if (!config.annotation || config.annotation.length <= 0) {
        config.annotation = ROUTER_NAME
    }
    if (!config.generatePath) {
        config.generatePath = ROUTER_GENERATE_PATH
    }
    if (config.generatePath.startsWith("/")) {
        config.generatePath = config.generatePath.substring(1)
    }
    if (config.generatePath.endsWith("/")) {
        config.generatePath = config.generatePath.substring(0,config.generatePath.length-1)
    }
    if (!config.generateName) {
        config.generateName = ROUTER_GENERATE_BUILDER_NAME
    }
    if (!config.generateMapName) {
        config.generateMapName = ROUTER_GENERATE_MAP_NAME
    }
    if (!config.generateName.endsWith(".ets")) {
        config.generateName = config.generateName + ".ets"
    }
    if (!config.generateMapName.endsWith(".ets")) {
        config.generateMapName = config.generateMapName + ".ets"
    }
    if (!config.routerDependencyName || config.routerDependencyName.length <= 0) {
        config.routerDependencyName = ROUTER_DEPENDENCY_NAME
    }
    if (!config.routerClassName || config.routerClassName.length <= 0) {
        config.routerClassName = ROUTER_CLASS_NAME
    }
    if (!config.routerModuleName || config.routerModuleName.length <= 0) {
        config.routerModuleName = ROUTER_MODULE_NAME
    }
    if (!config.routerConstantPath || config.routerConstantPath.length <= 0) {
        config.routerConstantPath = ROUTER_CONSTANT_PATH
    }
    if (config.debug) {
        console.log("AppRouterPlugin===" + JSON.stringify(config))
    }
    return {
        pluginId: "AppRouterPlugin",
        apply(node: HvigorNode) {
            const modulePath = node.getNodePath()
            const moduleDirName = path.basename(node.getNodePath())
            if (config.debug) {
                console.log("================================================================================");
                console.log("模块目录：" + modulePath);
            }
            let scanPath: string[] = []
            config?.scanPackagePath?.forEach((value) => {
                if (value.startsWith("/")) {
                    scanPath.push(modulePath + value)
                } else {
                    scanPath.push(modulePath + "/" + value)
                }
            })
            if (!scanPath || scanPath.length <= 0) {
                scanPath.push(modulePath + "/src/main/ets")
            }

            if (config.debug) {
                console.log("需要扫描的路径：" + JSON.stringify(scanPath));
            }
            let fileList: string[] = []
            scanPath.forEach((path) => {
                fileList.push(...getFileByFilter(path, config?.scanPackageName, config?.ignorePath, false))
            })

            //组件名称和import组件路径
            let routerBuilderInfo: RouterBuilderInfo[] = []
            //路由path相关
            let routerPath: RouterPathInfo[] = []
            //路由map相关
            let routerMap: RouterMapInfo[] = []
            let analyzer: Analyzer

            //设置被entry模块依赖的别名
            let entryDependencyName = config?.entryDependencyName
            if(!(config?.isEntry)){
                if(!entryDependencyName||entryDependencyName.length<=0){
                    entryDependencyName=moduleDirName
                }
            }
            fileList.forEach((etsPath) => {
                //如果是自动生成的文件则忽略
                let fileName = path.basename(etsPath)
                if(fileName==config?.generateName||fileName==config?.generateMapName){
                    return
                }
                if (config.debug) {
                    console.log("扫描到需要解析的ets文件：" + etsPath);
                }
                analyzer = new Analyzer(config?.annotation, etsPath, config?.debug)
                //解析组件内容，获取自定义注解参数
                analyzer.start()

                if (config.debug) {
                    console.log("result：" + JSON.stringify(analyzer.result));
                }
                if (analyzer.result.isRouterPage) {

                    let pageName = fileName.substring(0, fileName.lastIndexOf("."))
                    let importPath = (path.relative(modulePath+"/"+`${config?.generatePath}`, path.dirname(etsPath))+"/"+pageName)
                        .replace("\\", "/")
                    routerBuilderInfo.push({
                        viewName: pageName,
                        viewPath: importPath,
                        routerPath: analyzer.result.routerPath
                    })
                    if(analyzer.result.routerPath&&analyzer.result.routerPath.length>0){
                        routerMap.push({
                            sort: stringToAscii(analyzer.result.routerPath),
                            path: analyzer.result.routerPath,
                            pageName: pageName,
                            pageModule: entryDependencyName,
                            needLogin: analyzer.result.needLogin ?? false,
                            autoExecute: analyzer.result.autoExecute ?? false
                        })
                    }
                    let tempFlag = false
                    if (tempFlag) {
                        //这个功能目前比较鸡肋，暂时不用了
                        routerPath.push({
                            path: analyzer.result.routerPath,
                            pathDes: analyzer.result.routerPathDes
                        })
                    }

                }
            })

            if (config.debug) {
                // LG.info(JSON.stringify(routerBuilderInfo))
            }
            if(config?.isEntry){
                // 1:生成路由方法文件(主模块)
                generateEntryBuilderFile(routerBuilderInfo, config, modulePath);
            }else{
                // 1:生成路由方法文件(其他module)
                generateBuilderFile(routerBuilderInfo, config, modulePath);
            }

            let tempFlag = false
            if (tempFlag) {
                //这个功能目前比较鸡肋，暂时不用了
                //根据页面的path配置，生成常量类
                generateRouterPathFile(routerPath, config, node.getParentNode()?.getNodePath() ?? "");
            }
            // 2:生成路由表信息
            generateMapInfoFile(routerMap, config, modulePath);
            // 3:module 的index文件需要export builder和map
            generateIndexContent(node.getNodePath()+"/Index.ets",config)
            if (config.debug) {
                console.log("================================================================================");
            }
        }

    }
}

function generateEntryBuilderFile(routerBuilderInfo: RouterBuilderInfo[], config: AppRouterConfig, modulePath: string) {
    const builderPath = __dirname + "/entryViewBuilder.txt";
    const tpl = readFileSync(builderPath, {encoding: "utf8"});
    const template = Handlebars.compile(tpl);
    const output = template({
        viewList: routerBuilderInfo,
        routerDependencyName: config.routerDependencyName,
        routerClassName: config.routerClassName
    });

    const routerBuilderDir = modulePath + `/${config.generatePath}`;
    if (!existsSync(routerBuilderDir)) {
        mkdirSync(routerBuilderDir, {recursive: true});
    }
    writeFileSync(`${routerBuilderDir}/${config.generateName}`, output, {encoding: "utf8"});
}
function generateBuilderFile(routerBuilderInfo: RouterBuilderInfo[], config: AppRouterConfig, modulePath: string) {
    const builderPath = __dirname + "/viewBuilder.txt";
    const tpl = readFileSync(builderPath, {encoding: "utf8"});
    const template = Handlebars.compile(tpl);
    const output = template({
        viewList: routerBuilderInfo,
        routerDependencyName: config.routerDependencyName,
        routerClassName: config.routerClassName
    });

    const routerBuilderDir = modulePath + `/${config.generatePath}`;
    if (!existsSync(routerBuilderDir)) {
        mkdirSync(routerBuilderDir, {recursive: true});
    }
    writeFileSync(`${routerBuilderDir}/${config.generateName}`, output, {encoding: "utf8"});
}
function generateIndexContent(indexPath:string, config: AppRouterConfig) {
    if (!existsSync(indexPath)) {
        if(config.debug){
            LG.info("不存在："+indexPath)
        }
        return;
    }
    const content = readFileSync(indexPath, {encoding: "utf8"});
    const addContent:string[]=[]

    const importBuildContent="export * from \"./"+config.generatePath+"/"+config.generateName?.replace(".ets","")+"\""
    const importMapContent="export * from \"./"+config.generatePath+"/"+config.generateMapName?.replace(".ets","")+"\""
    if(config.generateName&&!content.includes(importBuildContent)){
        addContent.push(importBuildContent)
    }
    if(config.generateMapName&&!content.includes(importMapContent)){
        addContent.push(importMapContent)
    }
    if(addContent.length<=0){
        return
    }
    appendFileSync(indexPath,"\n\n"+addContent.join("\n\n"),{encoding: "utf8"});
}

function generateMapInfoFile(mapInfo: RouterMapInfo[], config: AppRouterConfig, modulePath: string) {
    //排序
    mapInfo.sort((a: RouterMapInfo, b: RouterMapInfo) => {
        return sortByAsciiStr(a.sort, b.sort)
    })
    const builderPath = __dirname + "/viewMap.txt";
    const tpl = readFileSync(builderPath, {encoding: "utf8"});
    const template = Handlebars.compile(tpl);
    const output = template({
        mapList: mapInfo,
        routerDependencyName: config.routerDependencyName,
        isEntry:config?.isEntry?"Entry":""
    });

    const routerBuilderDir = modulePath + `/${config.generatePath}`;
    if (!existsSync(routerBuilderDir)) {
        mkdirSync(routerBuilderDir, {recursive: true});
    }
    writeFileSync(`${routerBuilderDir}/${config.generateMapName}`, output, {encoding: "utf8"});
}
function generateRouterPathFile(routerBuilderInfo: RouterPathInfo[], config: AppRouterConfig, modulePath: string) {
    if (!modulePath || modulePath.length <= 0) {
        return
    }
    if (config.routerConstantPath.startsWith("/")) {
        config.routerConstantPath = config.routerConstantPath.substring(1)
    }
    if (!config.routerConstantPath.endsWith(".ets")) {
        config.routerConstantPath = config.routerConstantPath + ".ets"
    }
    //保存路由path的常量类路径
    const builderPath = modulePath + "/" + config.routerModuleName + "/" + config.routerConstantPath;
    //创建父目录
    const builderParentDir = path.dirname(builderPath)
    if (!existsSync(builderParentDir)) {
        mkdirSync(builderParentDir, {recursive: true});
    }

    const needAddContent: string[] = []
    //是否需要重新添加新内容
    let isAddNewContent: boolean = false;
    let pathContent = ""
    try {
        pathContent = readFileSync(builderPath, {encoding: "utf8"});
        //如果文件存在
        if (!pathContent.includes("export class " + path.basename(builderPath).replace(".ets", ""))) {
            isAddNewContent = true
            //如果常量类里面没有内容,最后一个}暂时不添加
            needAddContent.push("export class " + path.basename(builderPath).replace(".ets", "") + "{")
        }
    } catch (e) {
        //文件不存在
        isAddNewContent = true
    }
    let pathConstant = ""
    routerBuilderInfo?.forEach((item) => {
        let routerPath = item.path
        if (!routerPath || routerPath.length <= 0) {
            return
        }
        if (routerPath.startsWith("/")) {
            routerPath = routerPath.substring(1)
        }
        if (routerPath.endsWith("/")) {
            routerPath = routerPath.substring(0, routerPath.length - 1)
        }
        const index = routerPath.indexOf("/")
        let group: string = ""
        let name: string = routerPath
        if (index > 0) {
            //path是group+/+name格式
            group = routerPath.substring(0, index)
            name = "_" + routerPath.substring(index + 1)
        }
        pathConstant = "  static readonly " + group + name + ": string = \"" + item.path + "\""
        if (!isAddNewContent && pathContent.indexOf(pathConstant) >= 0) {
            return;
        }
        //如果不包含path,则添加内容
        needAddContent.push()
        needAddContent.push("  // " + item.pathDes + "\n" + pathConstant)
    })

    if (isAddNewContent) {
        needAddContent.push("}")
        writeFileSync(builderPath, needAddContent.join("\n"), {encoding: "utf8"});
    } else {
        //如果不是第一次添加内容，则追加内容
        const index = pathContent.lastIndexOf("}")
        if (index >= 0) {
            pathContent = pathContent.substring(0, index)
        }
        writeFileSync(builderPath, pathContent + needAddContent.join("\n\n") + "\n}", {encoding: "utf8"});

    }


}

function sortByAsciiStr(a?: string, b?: string): number {
    if (!a || !b) {
        return 0
    }
    const aLength = a.length;
    const bLength = b.length;
    if (aLength > bLength) {
        return 1
    } else if (aLength < bLength) {
        return -1;
    }
    const arrayA = a.split("")
    const arrayB = b.split("")
    for (let i = 0; i < aLength; i++) {
        let itemA = parseInt(arrayA[i])
        let itemB = parseInt(arrayB[i])
        if (itemA > itemB) {
            return 1
        } else if (itemA < itemB) {
            return -1;
        }
    }
    return 0
}

function stringToAscii(str?: string): string | undefined {
    if (!str || str.length <= 0) {
        return undefined
    }
    return str.split('').map(char => char.charCodeAt(0)).join("");
}
