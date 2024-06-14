export class LG {
    private static printLength = 200;
    private static TOP_LEFT_CORNER = '┌';
    private static BOTTOM_LEFT_CORNER = '└';
    private static HORIZONTAL_LINE = '│';
    private static DOUBLE_DIVIDER = "────────────────────────────────────────────────────────";
    private static TOP_BORDER = "┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────";
    private static BOTTOM_BORDER = "└────────────────────────────────────────────────────────────────────────────────────────────────────────────────";
    public static debug = true
    public static showStack = false
    public static showStackNum = 5

    static i(content: string | number, tag?: string) {
        if (LG.debug) {
            LG.info(content, tag)
        }
    }

    static info(content: string | number, tag?: string) {
        if (LG.debug) {
            if (content == null || content == undefined) {
                return
            }
            if (tag == null || tag == undefined) {
                tag = ""
            }
            content = content + ""

            let length = content.length
            LG.printPre(LG.TOP_BORDER, tag)


            if (length <= LG.printLength) {


                LG.logContent(content, tag)
                LG.printPre(LG.BOTTOM_BORDER, tag)
                return
            }
            for (let i = 0; i < length; i += LG.printLength) {

                LG.logContent(content.slice(i, i + Math.min(length - i, LG.printLength)), tag)
            }
            LG.printPre(LG.BOTTOM_BORDER, tag)
        }
    }

    private static packageName: string = ""

    static printPre(content: string, tag?: string) {
        LG.print(content, tag)
    }

    static logContent(content: string, tag?: string) {
        let split: string[] = content.split("\n")
        split.forEach((value) => {
            LG.printPre(LG.HORIZONTAL_LINE + value, tag)
        })
    }

    static print(content: string, tag?: string) {
        if (!tag) {
            tag = "log"
        } else {
            tag = "log:" + tag
        }
        console.info(content)
    }
}