/**
 * List item data entity.
 */
export class DataItem {
  /**
   * Image of list item.
   */
  image: Resource = $r('app.media.ic_normal');

  /**
   * Title of list item.
   */
  title: Resource = $r('app.string.list_item_title');

  detail: string = ''

  /**
   * Sub title of list item.
   */
  subTitle: Resource = $r('app.string.list_item_sub_title');

  subDetail: string = ''

  /**
   * Summary of list item.
   */
  summary: Resource = $r('app.string.list_item_summary');

  /**
   * Arrow image on the right of list item.
   */
  rightArrowImage: Resource = $r('app.media.ic_right_arrow');
}