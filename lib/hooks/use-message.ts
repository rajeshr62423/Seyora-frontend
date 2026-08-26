import { App } from "antd";

// antd's static `message.xxx()` API can't read the ConfigProvider theme, so
// every toast in this app goes through the `App.useApp()` context instead.
export function useMessage() {
  return App.useApp().message;
}
