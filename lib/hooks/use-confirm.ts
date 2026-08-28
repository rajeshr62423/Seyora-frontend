import { App } from "antd";

interface ConfirmOptions {
  title: string;
  content?: string;
  okText?: string;
  onConfirm: () => void;
}

// Same reasoning as useMessage: antd's static Modal.confirm() can't read the
// ConfigProvider theme, so every "are you sure?" dialog goes through
// App.useApp() instead. Centralizes the danger-styled confirm shape used
// before every destructive action (delete/revoke/disconnect/sign out).
export function useConfirm() {
  const { modal } = App.useApp();
  return ({ title, content, okText = "Delete", onConfirm }: ConfirmOptions) => {
    modal.confirm({
      title,
      content,
      okText,
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: onConfirm,
    });
  };
}
