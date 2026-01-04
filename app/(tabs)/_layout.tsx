import { ChartIcon, ListIcon } from "@/components/Icons"
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
        headerShown: true,
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
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: theme.fontSize.sm,
          fontWeight: theme.fontWeight.medium,
        },
      }}
    >
      <Tabs.Screen
        name="money-flow"
        options={{
          title: "Dòng tiền",
          tabBarIcon: ({ color, size }) => <ListIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Thống kê",
          tabBarIcon: ({ color, size }) => <ChartIcon size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
