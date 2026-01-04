Ok. Từ giờ mình sẽ **ưu tiên Zustand cho global state** (theme, auth, settings, v.v.) và **chỉ dùng `createContext` khi bắt buộc** (ví dụ một số thư viện yêu cầu Provider riêng).

Dưới đây là “cách chuẩn” để làm **theme bằng Zustand** trong React Native/Expo (không dùng Context):

## 1) Cấu trúc thư mục khuyến nghị

```
src/
  theme/
    tokens.ts
    themes.ts
    index.ts
  stores/
    settings.store.ts
  hooks/
    useTheme.ts
```

---

## 2) Tokens + themes (light/dark)

**`src/theme/tokens.ts`**

```ts
export const tokens = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const,
  radius: { sm: 8, md: 12, lg: 16, xl: 24 } as const,
  fontSize: { sm: 12, md: 14, lg: 16, xl: 20, "2xl": 24 } as const,
  fontWeight: { regular: "400", medium: "500", semibold: "600", bold: "700" } as const,
};
```

**`src/theme/themes.ts`**

```ts
import { tokens } from "./tokens";

export type ThemeMode = "system" | "light" | "dark";

export type Theme = {
  mode: "light" | "dark";
  colors: {
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;

    primary: string;
    success: string;
    danger: string;
  };
  spacing: typeof tokens.spacing;
  radius: typeof tokens.radius;
  fontSize: typeof tokens.fontSize;
  fontWeight: typeof tokens.fontWeight;
};

export const lightTheme: Theme = {
  mode: "light",
  colors: {
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#0f172a",
    textMuted: "#475569",
    border: "#e2e8f0",
    primary: "#2563eb",
    success: "#16a34a",
    danger: "#dc2626",
  },
  ...tokens,
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: {
    background: "#0b1220",
    surface: "#0f172a",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    border: "#1f2a44",
    primary: "#60a5fa",
    success: "#34d399",
    danger: "#fb7185",
  },
  ...tokens,
};
```

---

## 3) Store Zustand: lưu theme mode (system/light/dark)

**`src/stores/settings.store.ts`**

```ts
import { create } from "zustand";
import type { ThemeMode } from "@/theme/themes";

type SettingsState = {
  themeMode: ThemeMode; // system | light | dark
  setThemeMode: (mode: ThemeMode) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  themeMode: "system",
  setThemeMode: (themeMode) => set({ themeMode }),
}));
```

_(Nếu bạn muốn persist sang storage sau này, mình sẽ thêm `persist` + `AsyncStorage/MMKV`.)_

---

## 4) Hook `useTheme()` (tự resolve theo hệ thống + setting)

**`src/hooks/useTheme.ts`**

```ts
import { useColorScheme } from "react-native";
import { useSettingsStore } from "@/stores/settings.store";
import { darkTheme, lightTheme, type Theme } from "@/theme/themes";

export function useTheme(): Theme {
  const system = useColorScheme(); // 'light' | 'dark' | null
  const themeMode = useSettingsStore((s) => s.themeMode);

  const resolved = themeMode === "system" ? (system === "dark" ? "dark" : "light") : themeMode;

  return resolved === "dark" ? darkTheme : lightTheme;
}
```

✅ Không Context, không Provider.

---

## 5) Dùng theme trong component (chuẩn & gọn)

```tsx
import { View, Text } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export function BalanceCard() {
  const t = useTheme();

  return (
    <View
      style={{
        backgroundColor: t.colors.surface,
        borderColor: t.colors.border,
        borderWidth: 1,
        borderRadius: t.radius.lg,
        padding: t.spacing.lg,
      }}
    >
      <Text style={{ color: t.colors.textMuted, fontSize: t.fontSize.md }}>Số dư hiện tại</Text>

      <Text
        style={{
          color: t.colors.text,
          fontSize: t.fontSize["2xl"],
          fontWeight: t.fontWeight.bold,
          marginTop: t.spacing.sm,
        }}
      >
        12,500,000 ₫
      </Text>
    </View>
  );
}
```

---

## 6) Màn Settings đổi theme (light/dark/system)

```tsx
import { View, Pressable, Text } from "react-native";
import { useSettingsStore } from "@/stores/settings.store";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeMode } from "@/theme/themes";

const options: ThemeMode[] = ["system", "light", "dark"];

export function ThemePicker() {
  const t = useTheme();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);

  return (
    <View style={{ gap: t.spacing.sm }}>
      {options.map((m) => {
        const active = m === themeMode;
        return (
          <Pressable
            key={m}
            onPress={() => setThemeMode(m)}
            style={{
              padding: t.spacing.md,
              borderRadius: t.radius.md,
              borderWidth: 1,
              borderColor: active ? t.colors.primary : t.colors.border,
              backgroundColor: t.colors.surface,
            }}
          >
            <Text style={{ color: t.colors.text }}>{m.toUpperCase()}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
```
