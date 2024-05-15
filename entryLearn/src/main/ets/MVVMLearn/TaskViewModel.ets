// ，用于管理数据和业务逻辑。
import { TaskInterfaceModel } from './TaskInterfaceModel';
import { TaskModel } from './TaskModel';

class ViewModel {
  viewName?: string

}

export default class TaskViewModel {
  // ⚠️ 方案1 通过 interface 规范抽象新字段
  public tasks: Array<TaskInterfaceModel> = [];

  // ⚠️ 方案2 通过 viewModel 定义新字段
  public name?: string
  public viewModel?: ViewModel

  constructor() {
    this.tasks = [
      new TaskModel('Task 1'),
      new TaskModel('Task 2')
    ];

    // 接口返回后填充字段
    this.name = 'view model name'
    this.viewModel = new ViewModel()
  }

  addTask(title: string) {
    const newTask = new TaskModel(title);
    this.tasks.push(newTask);
  }

}
