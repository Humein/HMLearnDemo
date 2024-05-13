import { SimpleContacts } from './ListDemo';

@Entry
@Component
struct TabContentView {
  private arr: number[] = [1, 2, 3];

  build() {
    Column() {
      Tabs({ barPosition: BarPosition.Start  }) {
        TabContent() {
          // Text('首页的内容').fontSize(30)
          SimpleContacts()
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
}

function ListDemo() {
  throw new Error('Function not implemented.');
}
