import PageViewModel from '../viewmodel/PageViewModel';
import { DataItem } from '../viewmodel/DataItem';
import { CommonConstants } from '../constants/CommonConstants';
import router from '@ohos.router';

/**
 * Detail page list component.
 */
@Component
export struct DetailListComponent {
  build() {
    Column() {
      List() {
        ForEach(PageViewModel.getDetailListData(), (item: DataItem) => {
          ListItem() {
            Row() {
              Text(item.title)
                .fontSize($r('app.float.list_item_title'))
                .fontColor($r('app.color.list_item_title'))
              Blank()
              Text(item.summary)
                .fontSize($r('app.float.list_item_sub_title'))
                .fontColor($r('app.color.list_item_sub_title'))
            }
            .width(CommonConstants.ROW_WIDTH_PERCENT)
            .height($r('app.float.detail_list_item_height'))
          }.onClick(() => {
            router.pushUrl({ url: '' })
          })
        }, (item: DataItem, index?: number) => index + JSON.stringify(item));
      }
      .width(CommonConstants.LIST_WIDTH_PERCENT)
      .divider({
        strokeWidth: $r('app.float.divider_height'),
        color: $r('app.color.list_divider')
      })
    }
    .width(CommonConstants.LIST_WIDTH_PERCENT)
    .padding({
      top: $r('app.float.detail_list_padding_vertical'),
      bottom: $r('app.float.detail_list_padding_vertical'),
      left: $r('app.float.detail_list_padding_horizontal'),
      right: $r('app.float.detail_list_padding_horizontal')
    })
    .margin({ top: $r('app.float.list_margin_top') })
    .backgroundColor($r('app.color.list_content_background'))
    .borderRadius($r('app.float.list_radius'))
  }
}