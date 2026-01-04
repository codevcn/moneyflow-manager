import ChartIcon from "@/../assets/images/icons/chart-icon.svg"
import MoneyFlowIcon from "@/../assets/images/icons/money-flow-icon.svg"
import { useTheme } from "@/hooks/use-theme"
import { Tabs } from "expo-router"

/**
 * Tabs Layout - Main screen với 2 tabs
 */
export default function TabsLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.fontWeight.semibold,
          fontSize: theme.fontSize.lg,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          elevation: 0,
          height: 70,
          paddingTop: 8,
          paddingBottom: 8,
          borderBottomWidth: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: theme.fontSize.md,
          fontWeight: theme.fontWeight.bold,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="money-flow"
        options={{
          title: "Dòng tiền",
          tabBarIcon: ({ color, size }) => <MoneyFlowIcon width={size + 5} height={size + 5} color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Thống kê",
          tabBarIcon: ({ color, size }) => <ChartIcon width={size + 5} height={size + 5} color={color} />,
        }}
      />
    </Tabs>
  )
}
