import { EmptyStateIcon } from "@/components/Icons"
import { useTheme } from "@/hooks/use-theme"
import { StyleSheet, Text, View } from "react-native"

/**
 * Statistics Screen - Tab "Thống kê"
 */
export default function StatisticsScreen() {
  const theme = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <EmptyStateIcon size={120} color={theme.colors.textMuted} backgroundColor={theme.colors.surface} />
        <Text
          style={[
            styles.text,
            {
              color: theme.colors.textMuted,
              fontSize: theme.fontSize.lg,
              marginTop: theme.spacing.md,
            },
          ]}
        >
          Tính năng đang phát triển
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
})
