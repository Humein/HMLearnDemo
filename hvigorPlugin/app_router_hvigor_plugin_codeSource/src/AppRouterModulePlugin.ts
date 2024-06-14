import {HvigorNode, HvigorPlugin} from "@ohos/hvigor";
import {readFileSync} from "node:fs";
import path from "path";
import {existsSync, mkdirSync, writeFileSync} from "fs";

interface JsonContent {
    modules: JsonContent[]
    name: string
    srcPath: string
}


export function AppRouterModulePlugin(moduleList: string[], scanFile: string = "build-profile.json5", generatedPath: string = "src/main/ets/_generated/AppRouterModule.ets"): HvigorPlugin {
    return {
        pluginId: "AppRouterModulePlugin",
        apply(node: HvigorNode) {
            if (!moduleList || moduleList.length <= 0) {
                throw new Error("AppRouterModulePlugin需要传入主模块名")
            }
            moduleList.forEach((moduleName) => {
                moduleName = moduleName.replace("/", "")
                if (generatedPath.startsWith("/")) {
                    generatedPath = generatedPath.substring(1)
                }
                if (!generatedPath.endsWith(".ets")) {
                    generatedPath = generatedPath + ".ets"
                }
                if (scanFile.startsWith("/")) {
                    scanFile = scanFile.substring(1)
                }
                if (!existsSync(scanFile)) {
                    return
                }
                const jsonContent = readFileSync(scanFile, {encoding: "utf8"})
                    .replace(/\s+/g, '')
                    .replace(/,}+/g, "}")
                    .replace(/,]+/g, "]")

                try {
                    let content: JsonContent = JSON.parse(jsonContent)
                    let nameList: string[] = []
                    let modulePath = ""
                    content.modules.forEach((item) => {
                        if (item.name == moduleName) {
                            modulePath = item.srcPath
                        }else if(!moduleList.includes(item.name)){
                            nameList.push(item.name)
                        }
                    })
                    if(modulePath.length<=0){
                        return;
                    }
                    let outputPath = modulePath + "/" + generatedPath
                    if (!existsSync(outputPath)) {
                        mkdirSync(path.dirname(outputPath), {recursive: true});
                    }

                    let outputName = path.basename(generatedPath).replace(".ets", "")
                    let output = "export function getModuleNameList(): string[] {\n" +
                        "  return list\n}\n\n" +
                        "const list: string[] = " + "[\"" + nameList.join("\", \"") + "\"]" + "\n"
                    // console.log("模块名称：" + outputPath)
                    // console.log("=============" + output)
                    writeFileSync(outputPath, output, {encoding: "utf8"});
                } catch (e) {
                    console.log(node.getNodePath() + "/" + scanFile + "数据格式错误")
                    throw e
                }
            })
        }

    }
}
