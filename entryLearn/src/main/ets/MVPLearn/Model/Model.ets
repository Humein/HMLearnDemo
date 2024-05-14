// model.ts Model 负责处理应用程序的数据和业务逻辑。
export interface IPModel {
  fetchData(): Promise<string>;
}

export class Model implements IPModel {
  async fetchData(): Promise<string> {
    // 模拟异步数据获取
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Hello from the Model!");
      }, 1000);
    });
  }
}
