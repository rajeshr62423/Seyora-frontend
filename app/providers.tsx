"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App as AntdApp, ConfigProvider, theme as antdTheme } from "antd";
import { useMemo, type ReactNode } from "react";
import { Provider } from "react-redux";
import SeyoraPageLoader from "@/components/loading/SeyoraPageLoader";
import { NavigationLoaderProvider } from "@/lib/context/navigation-loader-context";
import { ProjectsProvider } from "@/lib/context/projects-context";
import { ThemeProvider, useTheme } from "@/lib/context/theme-context";
import { store } from "@/redux/store";

const SHARED_TOKENS = {
  colorPrimary: "#10B981",
  colorInfo: "#10B981",
  colorSuccess: "#4ADE80",
  colorWarning: "#FBBF24",
  colorError: "#F87171",
  borderRadius: 8,
  fontFamily: 'var(--font-manrope), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const DARK_TOKENS = {
  ...SHARED_TOKENS,
  colorBgBase: "#171C19",
  colorBgContainer: "#1D2521",
  colorBgElevated: "#171C19",
  colorBgLayout: "#101412",
  colorBorder: "#303A35",
  colorBorderSecondary: "#27302C",
  colorText: "#E5E7EB",
  colorTextSecondary: "#9CA3AF",
  colorTextTertiary: "#6B7280",
};

const LIGHT_TOKENS = {
  ...SHARED_TOKENS,
  colorPrimary: "#059669",
  colorBgBase: "#F8FAF9",
  colorBgContainer: "#FFFFFF",
  colorBgElevated: "#FFFFFF",
  colorBgLayout: "#F3F6F4",
  colorBorder: "#D1D9D5",
  colorBorderSecondary: "#E3E9E6",
  colorText: "#1A211E",
  colorTextSecondary: "#66736C",
  colorTextTertiary: "#94A3AF",
};

const COMPONENT_TOKENS = (bg: string, elevatedBg: string) => ({
  Button: { primaryColor: "#FFFFFF", colorPrimaryHover: "#34D399" },
  Modal: { contentBg: elevatedBg, headerBg: elevatedBg, titleColor: undefined },
  Select: { colorBgContainer: bg, optionSelectedBg: "rgba(16,185,129,.14)", controlHeight: 38 },
  Input: { colorBgContainer: bg, controlHeight: 38 },
  DatePicker: { colorBgContainer: bg, controlHeight: 38 },
  Table: { colorBgContainer: bg, headerBg: elevatedBg },
  Dropdown: { colorBgElevated: elevatedBg },
});

function AntdThemeBridge({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  const configTheme = useMemo(
    () =>
      theme === "dark"
        ? { algorithm: antdTheme.darkAlgorithm, token: DARK_TOKENS, components: COMPONENT_TOKENS("#1D2521", "#171C19") }
        : { algorithm: antdTheme.defaultAlgorithm, token: LIGHT_TOKENS, components: COMPONENT_TOKENS("#FFFFFF", "#FFFFFF") },
    [theme]
  );

  return <ConfigProvider theme={configTheme}>{children}</ConfigProvider>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <NavigationLoaderProvider>
      <AntdRegistry>
        <ThemeProvider>
          <AntdThemeBridge>
            <AntdApp>
              <Provider store={store}>
                <ProjectsProvider>{children}</ProjectsProvider>
              </Provider>
            </AntdApp>
          </AntdThemeBridge>
          <SeyoraPageLoader />
        </ThemeProvider>
      </AntdRegistry>
    </NavigationLoaderProvider>
  );
}
