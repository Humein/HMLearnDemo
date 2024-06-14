import {hvigor, HvigorNode, HvigorPlugin} from "@ohos/hvigor";
import fs from "node:fs";
import path from "path";

function stringToAscii(str: string): string {
    return str.split('').map(char => char.charCodeAt(0)).join();
}

export function test(): HvigorPlugin {
    return {
        pluginId: "testPlugin",
        apply(node: HvigorNode) {
            node.registerTask({
                name: "testPlugin",
                run: (taskContext) => {
                    console.log("================================================================================");

                    console.log(`Exec ${__dirname}`);
                    console.log("node.getParentNode()?.getNodePath()==" + node.getParentNode()?.getNodePath())
                    let a = fs.lstatSync(node.getNodePath() + "/src/main/ets/pages")
                    let b = fs.lstatSync(node.getNodePath() + "/src/main/ets/pages/")
                    let c = fs.lstatSync(node.getNodePath() + "/src/main/ets/pages/AA.ets")

                    let aa: string[] = []
                    aa.push(...[])
                    if (aa) {
                        console.log(aa + "====1======" + aa.length)
                    } else {
                        console.log(aa + "====2======")
                    }
                    console.log(a.isDirectory() + "===a==" + a.isFile() + "====" + path.basename(node.getNodePath() + "/src/main/ets/pages"));
                    console.log(b.isDirectory() + "===b==" + b.isFile() + "====" + path.basename(node.getNodePath() + "/src/main/ets/pages/"));
                    console.log(c.isDirectory() + "===c==" + c.isFile() + "====" + path.basename(path.dirname(node.getNodePath() + "/src/main/ets/pages/AA.ets")));
                    console.log(c.isDirectory() + "===c==" + c.isFile() + "====" + path.basename(node.getNodePath() + "/src/main/ets/pages/A.ets"));

                    console.log("customPlugin");
                    console.log(`Exec ${__dirname}`);
                    console.log(`getNodeName==${node.getNodeName()}`)
                    console.log(`getNodePath==${node.getNodePath()}`)
                    const workspaceDir = hvigor.getParameter().getWorkspaceDir();
                    console.log(workspaceDir);

                    // const parentDirectoryPath = path.dirname(__filename);
                    //
                    // console.log(parentDirectoryPath);

                    console.log(`${__filename}` + "====");
                    console.log(__filename + "====");
                    console.log(path.dirname(__dirname) + "====");
                    console.log("================================================================================");
                }
            })
        }
    }
}

