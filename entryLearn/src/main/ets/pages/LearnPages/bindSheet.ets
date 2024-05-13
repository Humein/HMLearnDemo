@Entry
@Component
struct BindSheetDemo {
  // 半模态转场显示隐藏控制
  @State isShowSheet: boolean = false;
  private filterList: string[] = ['1', '2', '3', '4', '5'];

  // 通过@Builder构建半模态展示界面
  @Builder
  mySheet() {
    Column() {
      Tabs({ barPosition: BarPosition.Start  }) {
        TabContent() {
          // Text('首页的内容').fontSize(30)
          // SimpleContacts()
        }
        .tabBar('首页')

        TabContent() {
          Text('推荐的内容').fontSize(30)
        }
        .tabBar('推荐')

        TabContent() {
          Text('发现的内容').fontSize(30)
        }
        .tabBar('发现')

        TabContent() {
          Text('我的内容').fontSize(30)
        }
        .tabBar("我的")
      }
    }
    .height('100%')
    .width('100%')
    .backgroundColor('#F1F3F5')
  }

  build() {
    Column() {
      Text('课程筛选')
        .fontSize(28)
        .padding({ top: 30, bottom: 30 })
      Column() {
        Row() {
          Row()
            .width(10)
            .height(10)
            .backgroundColor('#a8a8a8')
            .margin({ right: 12 })
            .borderRadius(20)

          Column() {
            Text('选课筛选')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
          }
          .alignItems(HorizontalAlign.Start)

          Blank()

          Row()
            .width(12)
            .height(12)
            .margin({ right: 15 })
            .border({
              width: { top: 2, right: 2 },
              color: 0xcccccc
            })
            .rotate({ angle: 45 })
        }
        .borderRadius(15)
        .shadow({ radius: 100, color: '#ededed' })
        .width('90%')
        .alignItems(VerticalAlign.Center)
        .padding({ left: 15, top: 15, bottom: 15 })
        .backgroundColor(Color.White)
        // 通过选定的半模态接口，绑定模态展示界面，style中包含两个参数，一个是设置半模态的高度，不设置时默认高度是Large，一个是是否显示控制条DragBar，默认是true显示控制条，通过onDisappear控制状态变量变换。
        .bindSheet(this.isShowSheet, this.mySheet(), {
          height: ('80%'),
          dragBar: false,
          onDisappear: () => {
            this.isShowSheet = !this.isShowSheet;
          }
        })
        .onClick(() => {
          this.isShowSheet = !this.isShowSheet;
        })
      }
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .backgroundColor(0xf1f1f1)
  }
}