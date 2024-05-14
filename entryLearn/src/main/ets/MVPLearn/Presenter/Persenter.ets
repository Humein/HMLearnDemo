// Presenter 作为 Model 和 View 之间的中介，处理从 View 获取的用户输入，并更新 Model 和 View。
import { IPModel } from '../Model/Model';
import { ListView } from '../View/ListView';

// presenter.ts

export interface IPPresenter {
  onFetchData(): void;
}

export class Presenter implements IPPresenter {
  private model: IPModel;
  private view: ListView;

  constructor(model: IPModel, view: ListView) {
    this.model = model;
    this.view = view;
    this.view.setPresenter(this);
  }

  async onFetchData(): Promise<void> {
    const data = await this.model.fetchData();
    this.view.updateView(data);
  }
}
