import util from '@ohos.util';

class Contact {
  key: string = util.generateRandomUUID(true);
  name: string;
  icon: Resource;

  constructor(name: string, icon: Resource) {
    this.name = name;
    this.icon = icon;
  }
}


class LeftContact {
  key: string = util.generateRandomUUID(true);
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

@Entry
@Component
export struct SimpleContacts {
  private contacts: Array<object> = [
    new Contact('小明', $r("app.media.ic_activated")),
    new Contact('小红', $r("app.media.ic_activated")),
    new Contact('小明', $r("app.media.ic_activated")),
    new Contact('小红', $r("app.media.ic_activated")),
    new Contact('小明', $r("app.media.ic_activated")),
    new Contact('小红', $r("app.media.ic_activated")),
    new Contact('小明', $r("app.media.ic_activated")),
    new Contact('小红', $r("app.media.ic_activated")),
    new Contact('小明', $r("app.media.ic_activated")),
    new Contact('小红', $r("app.media.ic_activated")),
  ]

  private leftContact: Array<object> = [
    new LeftContact('1'),
    new LeftContact('2'),
    new LeftContact('1'),
    new LeftContact('2'),
    new LeftContact('1'),
    new LeftContact('2'),
    new LeftContact('1'),
    new LeftContact('2'),
    new LeftContact('1'),
    new LeftContact('2'),
  ]

  build() {
    Row({ space: 10 }) {
      List() {
        ForEach(this.leftContact, (item: LeftContact) => {
          ListItem() {
            Row() {
              Text(item.name).fontSize(40)
            }
            .width('100%')
            .justifyContent(FlexAlign.Start)
          }
        }, (item: Contact) => item.key.toString())
      }.width('20%').height('50%').backgroundColor('#FFF1F3F5')
      List() {
        ForEach(this.contacts, (item: Contact) => {
          ListItem() {
            Row() {
              Image(item.icon)
                .width(40)
                .height(40)
                .margin(10)
              Text(item.name).fontSize(20)
            }
            .width('100%')
            .justifyContent(FlexAlign.Start)
          }
        }, (item: Contact) => item.key.toString())
      }.width('80%').height('50%').backgroundColor(0xD2B48C)
    }.width('100%')
  }
}