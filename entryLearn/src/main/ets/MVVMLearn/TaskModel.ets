// 用于表示数据模型。
import { TaskInterfaceModel } from './TaskInterfaceModel';

export class TaskModel implements TaskInterfaceModel {
  title: string;

  iName?: string

  constructor(title: string) {
    this.title = title;
    this.iName = title;
  }
}
