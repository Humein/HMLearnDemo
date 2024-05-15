// view.ts
import { Model } from '../Model/Model';
import { IPPresenter, Presenter } from '../Presenter/Persenter';

@Entry
@Component
export struct ListView {
  // ⚠️ 这个View 实际需要的字段值，而不是 接口 Model
  @State data: string = "Loading...";

  private presenter!: IPPresenter;

  public setPresenter(presenter: IPPresenter): void {
    this.presenter = presenter;
    this.presenter.onFetchData();
  }

  public updateView(data: string): void {
    this.data = data;
  }

  onPageShow() {
    // 将 Model、View 和 Presenter 实例化并整合在一起。
    const model = new Model();
    this.presenter = new Presenter(model, this);
    console.log('xx-----打印 presenter',  this.presenter)
  }

  build() {
    Column() {
      Text(this.data)
        .fontSize(20)
        .margin(10);
      Button("Refresh")
        .onClick(() => {
          this.data = 'Loading...'
          this.presenter.onFetchData();
        })
        .fontSize(20)
        .margin(10);
    }
  }
}
