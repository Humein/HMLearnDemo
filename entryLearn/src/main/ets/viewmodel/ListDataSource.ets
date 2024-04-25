import { DataItem } from './DataItem';

/**
 * Provides data sources required by the LazyForEach interface.
 */
export class ListDataSource implements IDataSource {
  private listItems: Array<DataItem> = [];
  private listener: DataChangeListener | null = null;

  constructor(list: Array<DataItem>) {
    this.listItems = list;
  }

  totalCount(): number {
    return this.listItems.length;
  }

  getData(index: number): DataItem {
    return this.listItems[index];
  }

  registerDataChangeListener(listener: DataChangeListener): void {
    this.listener = listener;
  }

  unregisterDataChangeListener(): void {
  }
}