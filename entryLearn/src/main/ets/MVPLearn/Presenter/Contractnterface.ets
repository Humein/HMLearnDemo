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
// 用于规范左侧选择数据；支持三种类型，时间：1，地点：2，更多
interface IModel {
  name: string
  subTitle?: string;
  age?: number;
  sayHello(): string; // sayHello方法，返回类型为void
}


class Employee implements IModel {
  id0?: string;
  name0?: string;

  name: string;
  constructor(name0: string) {
    this.name = name0;
  }

  sayHello(): string {
    return util.generateRandomUUID(true);
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
}

/*    Presenter      */
interface iPresenter {
  updateView(): void;
}

class EmployeePresenter implements iPresenter {
  model: IModel;
  // view: LeftContact;

  constructor(model: IModel) {
    this.model = model;
    // this.view = view;
  }

  updateView(): void {

  }
}


class LeftContact {
  key: string = util.generateRandomUUID(true);
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

/*    VIEW      */
@Entry
@Component
export struct SimpleContacts {

  private leftContact: Array<IModel> = [
    new Employee('hahah'),
    new Employee1('1'),
    new Employee('0'),
    new Employee1('2'),
  ]

  onPageShow() {
    this.leftContact = [
      new Employee('hahah'),
      new Employee1('1'),
      new Employee('0'),
      new Employee1('2'),
    ]
    console.log('xx-----this.leftContact 在这里填充数据不行', this.leftContact[0].name)
  }

  build() {
    Row({ space: 10 }) {
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
    }.width('100%')
  }
}