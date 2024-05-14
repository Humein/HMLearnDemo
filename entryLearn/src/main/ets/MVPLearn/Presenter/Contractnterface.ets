import { util } from '@kit.ArkTS';

// 定义一个Animal接口，有一个可选属性color
interface Animal {
  name: string; // 名字属性，类型为string
  color?: string; // 颜色属性，类型为string，可选
}

// 定义一个变量a1，类型为Animal接口，赋值一个有颜色属性的对象
let a1: Animal = {
  name: 'Cat',
  color: 'Black'
};

// 定义一个变量a2，类型为Animal接口，赋值一个没有颜色属性的对象
let a2: Animal = {
  name: 'Dog'

}

// 定义接口
interface Shape {
  x: number;
  y: number;
  // 定义抽象方法
  calculateArea(): number;
}

// 通过implements实现以上的接口
class Circle implements Shape {
  x: number;
  y: number;
  radius: number;
  // 构造器
  constructor(radius: number, x: number, y: number) {
    this.radius = radius;
    this.x = x;
    this.y = y;
  }
  // 实现Shape接口方法
  calculateArea() {
    return Math.PI * this.radius ** 2;
  }
}

// 实例化Circle
const circle = new Circle(5,0,0);
// 调用计算面积方法
console.log(String(circle.calculateArea()));


// FOR Harmony

/*    MODEL      */
// Model 负责处理应用程序的数据和业务逻辑。


// 用于规范左侧选择数据；支持三种类型，时间：1，地点：2，更多
export interface IModel {
  // 以下为针对复用的View而定义的 model interface 字段
  name?: string
  subTitle?: string;
  age?: number;

  // sayHello方法，返回类型为string
  sayHello(): string;

  // 网络请求 MVP中网络请求在model层
  fetchData(): Promise<string>;
}

export class EmployeeNet implements IModel {
  sayHello(): string {
    return util.generateRandomUUID(true);
  }

  async fetchData(): Promise<string> {
    // 模拟异步数据获取
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Hello from the EmployeeNet!");
      }, 1000);
    });
  }
}

export class Employee implements IModel {
  id0?: string;
  name0?: string;

  name: string;
  constructor(name0: string) {
    this.name = name0;
  }

  sayHello(): string {
    return util.generateRandomUUID(true);
  }

  async fetchData(): Promise<string> {
    // 模拟异步数据获取
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Hello from the Employee!");
      }, 1000);
    });
  }
}

class Employee1 implements IModel {
  id1?: string;
  name1?: string;

  name: string;
  constructor(name1: string) {
    this.name = name1;
  }
  sayHello(): string {
    return util.generateRandomUUID(true);
  }

  async fetchData(): Promise<string> {
    // 模拟异步数据获取
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Hello from the Employee1!");
      }, 1000);
    });
  }
}

/*    Presenter      */
// Presenter 作为 Model 和 View 之间的中介，处理从 View 获取的用户输入，并更新 Model 和 View。
export interface IPresenter {
  onFetchData(): void;
}

export class Presenter implements IPresenter {
  private model: IModel;
  private view: SimpleContacts;

  constructor(model: IModel, view: SimpleContacts) {
    this.model = model;
    this.view = view;
    this.view.setPresenter(this);
  }

  async onFetchData(): Promise<void> {
    const data = await this.model.fetchData();
    this.view.updateView(data);
  }
}

/*    VIEW      */
// View 负责呈现数据和捕获用户交互。在 ArkTS 中，View 通常是一个 UI 组件。
@Entry
@Component
export struct SimpleContacts {
  @State private leftContact: Array<IModel> = []

  @State data: string = "Loading...";
  private presenter?: IPresenter;

  setPresenter(presenter: IPresenter): void {
    this.presenter = presenter;
    this.presenter.onFetchData();
  }

  updateView(data: string): void {
    this.data = data;
  }

  onPageShow() {
    this.leftContact = [
      new Employee('hahah'),
      new Employee1('1'),
      new Employee('0'),
      new Employee1('2'),
    ]
    // 将 Model、View 和 Presenter 实例化并整合在一起。
    const model = new EmployeeNet();
    this.presenter = new Presenter(model, this);
    console.log('xx-----在这里填充数据必须使用 @State修饰 this.leftContact ', this.leftContact[0].name)
    console.log('xx-----打印 presenter this.leftContact ',  this.presenter)

  }

  build() {
    Column({ space: 10 }) {
      List() {
        ForEach(this.leftContact, (item: IModel) => {
          ListItem() {
            Row() {
              Text(item.name).fontSize(40)
              Text(item.sayHello()).fontSize(20)
            }
            .width('100%')
            .justifyContent(FlexAlign.Start)
          }
        },)
      }.width('100%').height('50%').backgroundColor('#FFF1F3F5')
      Column() {
        Text(this.data)
          .fontSize(20)
          .margin(10);
        Button("Refresh")
          .onClick(() => {
            this.data = 'Loading...'
            this.presenter?.onFetchData();
          })
          .fontSize(20)
          .margin(10);
      }.width('100%').height('50%').backgroundColor('#FFFFFFF')
    }.height('100%')
  }
}