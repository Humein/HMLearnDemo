import { CommonConstants } from '../constants/CommonConstants';
import { DataItem } from './DataItem';
import { TabItem } from './TabItem';
import { ListDataSource } from './ListDataSource';

/**
 * Binds data to components and provides interfaces.
 */
export class PageViewModel {
  /**
   * Get data sources required by the LazyForEach interface.
   *
   * @return {ListDataSource} new ListDataSource(listItems)
   */
  getListDataSource(): ListDataSource {
    let listItems: Array<DataItem> = [];
    for (let i = 0; i < CommonConstants.LIST_SIZE; i++) {
      let itemInfo: DataItem = new DataItem();
      itemInfo.image = $r('app.media.ic_normal');
      itemInfo.title = $r('app.string.list_item_title');
      switch (i) {
        case 0:
          itemInfo.title =  $r('app.string.list_item_title_0');
      }
      itemInfo.subTitle = $r('app.string.list_item_sub_title');
      itemInfo.summary = $r('app.string.list_item_summary');
      itemInfo.rightArrowImage = $r('app.media.ic_right_arrow');
      listItems.push(itemInfo);
    }
    return new ListDataSource(listItems);
  }

  /**
   * Get item information for the tab.
   *
   * @return {Array<TabItemInfo>} tabItems
   */
  getTabData(): Array<TabItem> {
    let tabItems: Array<TabItem> = [];
    for (let i = 0; i < CommonConstants.TAB_SIZE; i++) {
      let itemInfo: TabItem = new TabItem();
      itemInfo.imageOriginal = $r('app.media.ic_normal');
      itemInfo.imageActivated = $r('app.media.ic_activated');
      itemInfo.title = $r('app.string.tab_title');
      tabItems.push(itemInfo);
    }
    return tabItems;
  }

  /**
   * Get detail list Data.
   *
   * @return {Array<DataItem>} listItems
   */
  getDetailListData(): Array<DataItem> {
    let listItems: Array<DataItem> = [];
    for (let i = 0; i < CommonConstants.DETAIL_PAGE_LIST_SIZE; i++) {
      let itemInfo: DataItem = new DataItem();
      itemInfo.title = $r('app.string.detail_page_list_title');
      itemInfo.summary = $r('app.string.list_item_summary');
      listItems.push(itemInfo);
    }
    return listItems;
  }
}

let pageViewModel = new PageViewModel();

export default pageViewModel as PageViewModel;