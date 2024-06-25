import { AppRouter } from '@zhongrui/app_router/Index';

@Builder
function EntryBuilder(path: Object) {
  if (path == "" || path == null || path == undefined) {
  }
}

export function BuildRegister(group: string, name: string) {
  if (AppRouter.hasBuilder(group, name)) {
    return
  }
  AppRouter.registerAppRouterPage(group, name, wrapBuilder(EntryBuilder));
}