import { router } from '@kit.ArkUI';
import { CommonConstants } from '../constants/CommonConstants';
import { DataItem } from '../viewmodel/DataItem';
import { ListItemComponent } from './ListItemComponent';
import PageViewModel from '../viewmodel/PageViewModel';
import { hilog } from '@kit.PerformanceAnalysisKit';

/**
 * List area of the main tab content.
 */
@Component
export struct ListAreaComponent {
  build() {
    Column() {
      List() {
        LazyForEach(PageViewModel.getListDataSource(), (item: DataItem) => {
          ListItem() {
            ListItemComponent({ itemInfo: item })
          }
          .onClick(() => {
            console.log('xx----item', item.subDetail)
            // pages/LearnPages/HelloWorld
            // pages/LearnPages/ListDemo
            //  CommonConstants.PAGE_NAME,
            // pages/LearnPages/bindSheet
            router.pushUrl({
              url: item.subDetail,
              params: {
                data: item.detail
              }
            });
          })
        }, (item: DataItem, index?: number) => index + JSON.stringify(item))
      }
      .width(CommonConstants.LIST_WIDTH_PERCENT)
      .divider({
        strokeWidth: $r('app.float.divider_height'),
        color: $r('app.color.list_divider'),
        startMargin: $r('app.float.list_divider_start_margin'),
        endMargin: $r('app.float.list_divider_end_margin')
      })
    }
    .width(CommonConstants.COLUMN_WIDTH_PERCENT)
  }
}