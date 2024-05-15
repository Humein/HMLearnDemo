// 用于定义UI界面。
import { TaskInterfaceModel } from './TaskInterfaceModel';
import TaskViewModel from './TaskViewModel';

@Entry
@Component
struct TaskView {
  private viewModel: TaskViewModel = new TaskViewModel();

  build() {
    Column() {
      ForEach(this.viewModel.tasks, (task: TaskInterfaceModel) => {
        Row() {
          Text(task.iName)
            .fontSize(20)
          Text(this.viewModel.name)
            .fontSize(10)
        }
      },)
      TextInput({ placeholder: 'New Task' })
        .onChange((value: string) => this.newTaskTitle = value)
      Button('Add Task')
        .onClick(() => this.addNewTask())
    }
  }

  private newTaskTitle: string = '';

  private addNewTask() {
    if (this.newTaskTitle) {
      this.viewModel.addTask(this.newTaskTitle);
      this.newTaskTitle = '';
    }
  }
}
